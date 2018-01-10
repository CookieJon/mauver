<template lang="pug">
  <q-card-media overlay-position="top" color='dark'>

    //- <!-- Notice the slot="overlay" -->
    q-card-title(slot='overlay')
      //- p.small|VALUE {{value}}
      //- p.small|VALUE {{myValue}}{{myValue.filters}}
      span(slot="subtitle")

    q-card-main
      div.row 
        div.col
          j-canvas(:imageData='slidingSpeedsImageData',width="60px",height="60px")
          j-lever(v-model='controlTargetPower', rest='50%', :markers='true', 
            :labelAlways='true', 
            @start='__startSliding'
            @stop='__stopSliding'
            @drag='__dragLever'
            :range={
              'min': -10000,
              '35%': -1200,
              '45%': -100,
              '50%': 0,
              '55%': 100,
              '65%': 1200,
              'max': 10000
            }		
          ) 
          //- p|x{{myValue.filters}}
          j-collection.frame-type-grid(v-model='jFilters', @add='onAddFilter')
          q-select.col(stack-label='Palette', dark, v-model='paletteDDL', :options='paletteOptions')
       
        div.col
          j-canvas(:imageData='slidingImageData',width='420px',height="420px")    
          q-input.col(stack-label='Sliding Speeds Pattern', dark, v-model='slidingSpeedsPattern')
      div.row
        q-input.col(readonly,stack-label='started', dark, v-model='slidingStarted')
        q-input.col(stack-label='Control Target Power', dark, v-model='controlTargetPower')
      div.row
        q-input.col(stack-label='Control Power', dark, v-model='controlPower')
        q-input.col(stack-label='Sliding Speed Power', dark, v-model='slidingSpeedPower')
      //- <p>$・Italian, Cafe</p>
      //- <p class="text">Small plates, salads & sandwiches in an intimate setting.</p>
    </q-card-main>
  </q-card-media>

</template>

<script>
/* eslint-disable */
// import Utils from '../../utils'
// import { Utils } from 'quasar'
// import { Platform } from 'quasar'
// const TWEEN = require('es6-tween')

import {QCard, QCardMain, QCardSeparator, QCardMedia, QCardTitle, QField, QInput, QSelect} from 'quasar'
var jLever = require('components/custom/j-lever')
var jCanvas = require('components/custom/j-canvas')
var jCollection = require('components/custom/j-collection')
import Sortable from 'sortablejs'
import { extend } from 'quasar'
var crunch = require("number-crunch");
import ColorUtils from '../../moe/utils/moe.utils.color.js'

export default {
  name: "j-artwork",
  components: { jLever, jCollection, QCard, QCardMain, QCardSeparator, QCardMedia, QCardTitle, QField, QInput, jCanvas, QSelect },
  props: {
    value: {
      type: Object  // 'moe.objects.artwork' (so far)
    }
  },
  data () {
    return {
      paletteOptions: ColorUtils.presetPalettes.map(v=>{return {'label':v, 'value':v}}),
      paletteDDL: null,
      myValue: {a:'empty'},
      // >>>><> move to Artwork...!!!!
      palette: null,

      sliderInterval: 10,         // Timeout for continuous press
      myFilters: [{id:'test'},{id:'test2'},{id:'test3'}],
      jFilters: [],
      // bignum crunching base-256 arrays
      slidingLower: [],
      slidingCurrent: [],
      slidingUpper: [],
      slidingTmp: [],

      slidingImageData: null, // 
      slidingSpeedsImageData: null, // Visual representation of the speed.

      slidingSpeedsPattern: '10,20,80,140,140,140,170,200',
      slidingSpeeds: [],
      slidingSpeedsLength: 0,
      slidingSpeedsGradations: 0,

      controlMax: 65536,      // The abs(maximum value of the power?)
      controlTargetPower: 0,	// Current position of the knob 
      controlPower: 0,        // Current power. I.e. How many significant digits into the 65536 pixels are changes being applied?
      controlDirection: 0,    // ?? 1=up, -1=down, 0=stopped

      slidingSpeedPower: 0,

      slidingAnimId: null,
      slidingStarted: false

    }
  },
  computed: {
    // https://github.com/SortableJS/Vue.Draggable
    // jFilters: {
    //   get() {
    //     alert('get' + this.value)
    //     return extend({}, {val: this.value.filters}).val
    //   },
    //   set(value) {
    //     alert('asset')
    //   }
    // },
    myImageData () {
      return this.value ? this.value.imageData : null
    }
  },  
  watch: {
    jFilters (old, newValue) {
      alert('set')
      this.myValue.filters = value
      this.onUpdate()
    },
    value (old, newValue) {
      console.log("watch new value...", newValue)
      this.myValue = extend({}, {val: this.value}).val
    },
    paletteDDL(newValue, oldValue) {
      
    }
  },
  methods: {
    onUpdate (e) {
      let tmp = extend({}, {val: this.myValue}).val
      this.$emit('input', tmp)
    },
    onAddFilter (e) {
      debugger
      let tmp = extend({}, {val: this.myValue}).val
      tmp.filters.push(this.$state.bitmaps[0])
      this.$emit('input', tmp)
    },    
    __init() {
      this.slidingLower = new Array(65536).fill(0)
      this.slidingCurrent = new Array(65536).fill(0)
      this.slidingUpper = new Array(65536).fill(255)
      this.slidingSpeeds = new Array(65536).fill(0)
      this.slidingImageData = new ImageData(256, 256)
    },

    __populateSlidingSpeeds() {
      
      let speeds = this.slidingSpeedsPattern.split(',')
      this.slidingSpeedsLength = speeds.length
      this.slidingSpeedsGradations = parseInt(65536 / this.slidingSpeedsLength)
      for (let i=0; i<65536; i++) {
        this.slidingSpeeds[i] =  parseInt(speeds[i%speeds.length]);
      }

    },

    __startSliding() {
      //this.slidingImageData = theBitmap.context1.getImageData(0, 0, 256, 256);

	    // this.slidingCurrent = getNumArrayFromPixels(theBitmap.pixels1);
	    // this.slidingTmp = getNumArrayFromPixels(theBitmap.pixels1);

      // this.slidingImageData = this.$state.activeBitmap.getImageData()
      this.slidingCurrent = Array.prototype.slice.call(this.$state.activeBitmap.pixels)
      this.slidingTmp = Array.prototype.slice.call(this.$state.activeBitmap.pixels)
 
      this.__populateSlidingSpeeds()

      this.controlPower = 0
      this.controlTargetPower = 0

      this.__dragLever()

      this.slidingStarted = true
      this.slidingAnimId = requestAnimationFrame(this.__animateSliding)

    },

    __stopSliding() {
      console.log('stop leel')
      this.slidingStarted = false
      cancelAnimationFrame(this.slidingAnimId)
      try {
        this.$state.activeBitmap.pixels_key.slice(this.slidingCurrent)
      } catch(e) {
        console.warn("EMPTY ACTIVE BITMAP")
      }
    },

    __dragLever() {
      this.__computeSlidingSpeed(this.controlTargetPower);
    },

    __animateSliding() {

      this.slidingCurrent = (this.controlDirection > 0) 
        ? crunch.add(this.slidingCurrent, this.slidingSpeed) 
        : crunch.sub(this.slidingCurrent, this.slidingSpeed)

      // recCounter++;
      if (this.slidingCurrent.length!=65536) {

        this.slidingCurrent.shift(1);
        
        console.log('too high beep!')
        //oRangeDisplay.val(oRangeDisplay.val() + " \n " + " Stopping @ " + (controlDirection > 0 ? "UPPER":"LOWER") );
        this.__stopSliding();
        
      } 
    
      let theColor, mappedIndex
      
      let tmp = new ImageData(256,256)
      //tmp.data.fill(125)
      for (var i=0; i<65536; i++ ) {
        //  mappedIndex = (slidingMap[i*2] + 256*slidingMap[i*2+1]) *4 ;  // *2=x,y *4 = R,G,B,A
        mappedIndex = i * 4;
        try {
          theColor = this.$state.activeBitmap.palette_key[this.slidingCurrent[i]];
          
          tmp.data[mappedIndex] = theColor.r; //*4 =*4 =*4 =*4 = !! NB!!!
          tmp.data[mappedIndex+1] = theColor.g;
          tmp.data[mappedIndex+2] = theColor.b;
          tmp.data[mappedIndex+3] = 255;
        } catch(e) {
          console.log('error',this.$state.activeBitmap.palette_key, theColor, this.slidingCurrent[i], i)
          console.log(i, this.slidingCurrent[i], this.slidingCurrent.length);
          this.__stopLever()
          return;
        }
      }
      this.slidingImageData = tmp
      //this.$state.activeBitmap.imageData = tmp
      this.slidingAnimId = requestAnimationFrame(this.__animateSliding);
      // Render to canvas
      //

      // texture.image.data = theBitmap.context1.getImageData(0,0,256,256);
      // texture.needsUpdate = true;

      // texture.image.data = slidingImageData;
        //    texture.needsUpdate = true;

      // mesh.material.map.image = theBitmap.context1.getImageData(0,0,256,256);
      //  mesh.material.map.needsUpdate = true;

      // theBitmap.context1.putImageData(slidingImageData,0,0);
      // theCanvasContext.drawImage(theBitmap.canvas1,0,0);	

        // DEBUG
        //
        // var position = "";
        // for (var p=0;p<256;p+=32) {
        //   position+=(slidingCurrent[p*256+p]+"-");
        // }
        // oRangeDisplay.val(position + "\n Power: " + controlPower + "\nRate: " + slidingSpeedPower); 	// readout
        
      //}
    
      // 2. Continue @ANIM 
      //
      //this.slidingAnimId = requestAnimationFrame(this.animateSliding);
    },

    __computeSlidingSpeed() {

	    // val should be (currently) from -10,000 to +10,000
	
      // 1. Calculate speed
      //
      this.controlDirection = (this.controlTargetPower > 0) ? 1 : -1;
      this.controlPower = Math.abs(this.controlTargetPower);
      
      // original method:
      //
      // slidingSpeedPower = parseInt( ((65536 )*Math.abs(val)/1000) ) ;
      //
      // new method:
      //
      this.slidingSpeedPower = parseInt(this.controlPower/10000 * this.slidingSpeedsGradations) * this.slidingSpeedsLength;

      // record 
      //
      // if (slidingSpeedPower!=recLevel) {
      //   recHistory.push([recLevel, recCounter]);
      //   recLevel = slidingSpeedPower;
      //   recCounter=0;
      // }
	
	    this.slidingSpeed = this.slidingSpeeds.slice(0, this.slidingSpeedPower); // GOOD METHOD (but Remember the better one you thought of!!!)

      // Visualisation
      let tmp = new ImageData(256,256)
      let inset = (65536 * 4) - this.slidingSpeedPower * 4
      for (let i = 0 ; i < this.slidingSpeedPower; i++ ) {
        tmp.data[inset++] = this.slidingSpeed[i]
        tmp.data[inset++] = this.slidingSpeed[i]
        tmp.data[inset++] = this.slidingSpeed[i]
        tmp.data[inset++] = 255
      }
      this.slidingSpeedsImageData = tmp    
    }


  },
  created () {
    this.__init()
    console.log("Sliding speeds:", this.slidingSpeeds);

    console.log("Slider imagedata:", this.slidingImageData.data)
    // console.log("slidingSpeedsLength:", slidingSpeedsLength);
    // console.log("slidingSpeedsGradations:", slidingSpeedsGradations);
  },
  beforeDestroy () {
  }
}
</script>
<style lang="stylus">
  .dark-example
    background #333 
</style>