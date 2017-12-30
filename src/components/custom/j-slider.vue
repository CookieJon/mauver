<template lang="pug">
  <q-card-media overlay-position="full" color='dark'>
  
    j-canvas(:imageData='slidingSpeedsImageData')
    //- <!-- Notice the slot="overlay" -->
    //- <q-card-title slot="overlay">
    //-   |Title
    //-   <span slot="subtitle">Subtitle</span>
    //- </q-card-title> 
    <q-card-separator />
    <q-card-main slot="overlay">
      j-lever(v-model='controlTargetPower', rest='50%', :markers='true', 
        :labelAlways='true', 
        @start='__startLever'
        @stop='__stopLever'
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
    q-input(stack-label='Sliding Speeds Pattern', dark, v-model='slidingSpeedsPattern')
    q-input(stack-label='Control Target Power', dark, v-model='controlTargetPower')
    q-input(stack-label='Control Power', dark, v-model='controlPower')
    q-input(stack-label='Sliding Speed Power', dark, v-model='slidingSpeedPower')
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

import {QCard, QCardMain, QCardSeparator, QCardMedia, QCardTitle, QField, QInput} from 'quasar'
var jLever = require('components/custom/j-lever')
var jCanvas = require('components/custom/j-canvas')



export default {
  name: "j-slider",
  components: { jLever, QCard, QCardMain, QCardSeparator, QCardMedia, QCardTitle, QField, QInput, jCanvas },
  props: {
 
  },
  data () {
    return {
      sliderInterval: 10,         // Timeout for continuous press

      // bignum crunching base-256 arrays
      slidingLower: [],
      slidingCurrent: [],
      slidingUpper: [],
      slidingTmp: [],

      slidingImageData: null, // 
      slidingSpeedsImageData: null, // Visual representation of the speed.

      slidingSpeedsPattern: '10,20,80,140,140,140,170,200,255,255,255,255,0,0,0,0',
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
   
  },  
  watch: {
    // controlTargetPower: function(newValue) {
    //   let tmp = new ImageData(255,255)
    //   for (let i=0; i< 65536; i++ ) {
    //     tmp.data[i*4] = parseInt(Math.random()*200)
    //     tmp.data[i*4+1] = parseInt(Math.random()*200)
    //     tmp.data[i*4+2] = parseInt(Math.random()*200)
    //     tmp.data[i*4+3] = 255
    //   }
    //   this.slidingImageData = tmp      
    //   // this.$state.activeBitmap.add(newValue)
    //   // this.$state.activeBitmap.title='asd'+newValue
    //   // this.$state.activeBitmap.pixels_key[0]++
    //   //console.log("ASD")
    // }
  },
  methods: {
 
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

    __startLever() {
      //this.slidingImageData = theBitmap.context1.getImageData(0, 0, 256, 256);

	    // this.slidingCurrent = getNumArrayFromPixels(theBitmap.pixels1);
	    // this.slidingTmp = getNumArrayFromPixels(theBitmap.pixels1);
      this.slidingCurrent = Array.prototype.slice.call(this.$state.activeBitmap.pixels)
      this.slidingTmp = Array.prototype.slice.call(this.$state.activeBitmap.pixels)

      this.__populateSlidingSpeeds()

      this.controlPower = 0
      this.controlTargetPower = 0

      this.__dragLever()

      this.slidingStarted = true
      this.slidingAnimId = requestAnimationFrame(this.__animateSliding)

    },

    __stopLever() {

    },

    __dragLever() {
      this.__computeSlidingSpeed(this.controlPower);
    },

    __animateSliding() {


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
      let tmp = new ImageData(255,255)
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