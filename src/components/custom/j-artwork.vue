<template lang="pug">


  div.row
    //- div.row
      //- h6|Bitmap
      //- j-collection.frame-type-grid(v-model='myFilters', @add='addFilter($event)', style='width:80px; height: 400px')


    div.col-4
      // DEBUG
      q-card(color='dark')
        q-card-title
          div(slot='subtitle')|Debug
        q-card-main()
            div.row
              //- |{{this.myValue.options}}
              |{{this.myValue.slidingCurrent ? this.myValue.slidingCurrent.slice(-4) : 'no'}}

      // BITMAP
      q-card(color='dark')
        q-card-title
          div(slot='subtitle')|Bitmap
        q-card-main()
            div.row
              j-drop-target.frame-type-grid(:value='myBitmap', @add='dropBitmap($event)')
              div
                q-field(
                  icon="satellite",
                  dark)
                    q-btn(small, push)|Test
      // PALETTE
      q-card(overlay-position="top", color='dark')
        q-card-title(slot='overlay')

          div(slot='subtitle')
            q-toggle(v-model="myValue.options.useNewPalette", label='Bespoke Palette')
            q-toggle(v-model="myValue.options.remapBitmapToPalette", label='Remap Bitmap')

            
        q-card-main
            div.row
              j-drop-target.frame-type-grid(:value='myPalette', @add='dropPalette($event)')
              div
              q-field(icon="satellite",dark)
                //- q-toggle(v-model="myValue.options.paletteFromBitmap" label="Palette from Bitmap")
                //- q-option-group(
                //-   type="toggle",
                //-   v-model="myOptions",
                //-   :options=`[
                //-     {label: 'Palette from Bitmap', value: 'paletteFromBitmap'},
                //-     {label: 'Remap Bitmap', value: 'remapBitmapToPalette'}
                //-   ]`)
              q-field(icon="satellite",dark)
                q-btn(small, push)|Test
      // SLIDER
      q-card(overlay-position="top", color='dark')
        q-card-title(slot='overlay')
          div(slot='subtitle')|Slider
        q-card-main
          j-lever(v-model='controlTargetPower', rest='50%', :markers='true',
            :labelAlways='true',
            @start='__startSliding'
            @stop='__stopSliding'
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
    

    div.col-8
      // PREVIEW
      q-card(overlay-position="top", color='dark')
        //- q-card-title(slot='overlay')
        //-   div(slot='subtitle')|Preview
        q-card-main
          canvas(ref='preview', width='256', height='256', style='width:100%;height:100%;')


      div.row
      q-select.col(stack-label='Palette', dark, v-model='paletteDDL', :options='paletteOptions')


      div.row
        q-input.col(stack-label='Sliding Speeds Pattern', dark, v-model='slidingSpeedsPattern')
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

import {QToggle, QOptionGroup, QBtn, QCard, QCardMain, QCardSeparator, QCardMedia, QCardTitle, QField, QInput, QSelect} from 'quasar'
var jLever = require('components/custom/j-lever')
var jCanvas = require('components/custom/j-canvas')
var jCollection = require('components/custom/j-collection')
var jDropTarget = require('components/custom/j-droptarget')
import Sortable from 'sortablejs'
import { extend } from 'quasar'
var crunch = require("number-crunch");
import ColorUtils from '../../moe/utils/moe.utils.color.js'

let
  CURRENT_TIME,
  LAST_TIME = Date.now(),
  ELAPSED_TIME

let
  SLIDING_CURRENT

export default {
  name: "j-artwork",
  components: {
    jCanvas, jLever, jCollection, jDropTarget,
    QToggle, QOptionGroup, QBtn, QCard, QCardMain, QCardSeparator, QCardMedia, QCardTitle, QField, QInput, QSelect
  },
  props: {
    value: {
      type: Object  // 'moe.objects.artwork' (so far)
    }
  },
  data () {
    return {
      paletteOptions: ColorUtils.presetPalettes.map(v=>{return {'label':v, 'value':v}}),
      paletteDDL: null,
      myValue: null,

      // artwork preview image
      myCtx: null,
      // other contrl previw images...
      //
      // myImageData - computed.
      // myPaletteImageData - computed.
      myPixels: null,
      myPaletteColors: null,

      // >>>><> move to Artwork...!!!!
      bitmap: null,
      palette: null,
      pixels: null,
      imageData: null,

      sliderInterval: 10,         // Timeout for continuous press

      // bignum crunching base-256 arrays
      slidingLower: [],
      slidingCurrent: null,
      slidingUpper: [],

      slidingImageData: null, //
      slidingSpeedsImageData: null, // Visual representation of the speed.

      slidingSpeedsPattern: '1,2,3,2,1,1,1,1,1,2,3,2',
      slidingSpeeds: [],
      slidingSpeedsLength: 0,
      slidingSpeedsGradations: 0,

      controlMax: 65536,      // The abs(maximum value of the power?)
      controlTargetPower: 0,	// Current position of the knob
      controlActualPower: 0,  // Smoothstep power wrt TargetPower
      controlPower: 0,        // Current power. I.e. How many significant digits into the 65536 pixels are changes being applied?
      controlDirection: 0,    // ?? 1=up, -1=down, 0=stopped

      slidingSpeedPower: 0,

      slidingAnimId: null,
      slidingStarted: false
    }
  },
  computed: {
    // https://github.com/SortableJS/Vue.Draggable
    myFilters: {
      get () {
        return this.value.filters
      },
      set() {
        //alert('sorted')
      }
    },
    myOptions: {
      get () {
        return this.options
      }
    },
    myPalette: {
      get () {
        return this.value.palette
      },
      set() {
        // alert('sorted!')
      }
    },
    myBitmap: {
      get () {
        return this.value.bitmap
      },
      set() {
        // alert('sorted!')
      }
    },
    myImageData () {
      // NB. Only used for icon & general. preview imageData is handled manually updating ctx for Art because of fast control, don't  want watchers.
      return this.value ? this.value.imageData : null
    },
    myPaletteImageData () {
      return this.value && this.value.palette ? this.value.palette.imageData : null
    }
  },
  watch: {
    value: {
      handler: function (val, oldVal) {
        console.log("WATCH ==> artwork.value", val, oldVal)
        if (!oldVal || val.id != oldVal.id) {
          console.log('Different artwork.value!')
          let imgData = new ImageData(256,256)
          if (this.myCtx) this.__updatePreview(imgData)
        }
        this.myValue = extend({}, {val}).val
        this.render()
      },
      immediate: true
    },
   'value.options': {
      handler: function(val, oldVal) {
        // let art = this.render()
        console.log("WATCH ==> artwork.value.options", val, oldVal)
        let art = {
          id: this.value.id,
          options: val
        }
        this.$store.dispatch('updateFields', {artworks: [art]} )          
      },
      deep: true
    },
    paletteDDL(newValue, oldValue) {
      // var newPalette = ColorUtils.GeneratePaletteColors(newValue)
      // console.log('GENERATED:', newPalette)
      // this.$state.activeBitmap.palette  = newPalette
    }
  },
  methods: {
    onUpdate (e) {
      let tmp = extend({}, {val: this.myValue}).val
      this.$emit('input', tmp)
    },

    __updatePreview(imgData) {
      
      this.myCtx.putImageData(imgData,0,0)
    },

    // RENDER
    //
    render() {
      console.log('RENDER!')

      let v = this.myValue
      // FIX ALL THIS SPAGHETTI WITH FILTERS!
      // TODO: Design

      if (!v.bitmap) {
        return
      }

      // PALETTE + PIXELS
      if (v.options.useNewPalette) {
        // USE PALETTE PALETTE
        if (v.options.useNewPalette & v.options.remapBitmapToPalette) {
          // Remap bitmap to palette
          let bitmapColors = v.bitmap.palette.colors
          let paletteColors = v.palette.colors
          let map = bitmapColors.map(b => { 
            let mapToIndex = paletteColors.findIndex(p => {return p.id === b.id})
            return mapToIndex > -1 ? mapToIndex : 0
          })
          for (let i = 0; i < v.bitmap.pixels.length; i++) {
            v.pixels[i] = map[v.bitmap.pixels[i]]
          }
          
        } else {
          v.pixels = v.bitmap.pixels
        }    
      } else {
        //USE BITMAP PALETTE
        v.palette = v.bitmap.palette
        v.pixels = v.bitmap.pixels
      }

      // PIXELS



      // SLIDING CURRENT PIXELS
      if (v.slidingCurrent) {
        SLIDING_CURRENT = Array.prototype.slice.call(v.slidingCurrent)
      }
      else if (v.pixels) {
        SLIDING_CURRENT = Array.prototype.slice.call(v.pixels)
      }
      else {
        SLIDING_CURRENT = Array(65536).fill(0)
      }

      // Preview Image &
      // ImageData
      let imgData = new ImageData(256,256)
      try {
        for (var i=0; i<65536; i++ ) {
          let mappedIndex = i * 4;
          let theColor = v.palette.colors[SLIDING_CURRENT[i]]
          if (!theColor) console.log('NO COLOR @'+i, SLIDING_CURRENT, SLIDING_CURRENT[i], v.palette.colors)
          imgData.data[mappedIndex] = theColor.r
          imgData.data[mappedIndex+1] = theColor.g
          imgData.data[mappedIndex+2] = theColor.b
          imgData.data[mappedIndex+3] = 255;
        }
      } catch(e) {
        console.warn('Render error:', e)
      }
      v.imageData = imgData
      this.$nextTick(() => {
        this.myCtx.putImageData(imgData,0,0)
      })
      

      // RETURN RENDERED ARTWORK
      return v

    },

    configurePalette() {

    },
    dropPalette(e) {
      e.item.remove() // will be added by v-for instead
      let obj = e.clone.obj
      this.myValue.palette = obj
      this.myValue.pixels = null
      this.myValue.slidingCurrent = null
      // this.myValue.pixels = null
      // this.myValue.slidingCurrent = null

      let art = this.render()
      this.$store.dispatch('updateFields', {artworks: [art]} )
    },
    dropBitmap(e) {
      e.item.remove() // will be added by v-for instead
      let obj = e.clone.obj
      this.myValue.bitmap = obj
      this.myValue.pixels = null
      this.myValue.slidingCurrent = null

      let art = this.render()
      this.$store.dispatch('updateFields', {artworks: [art]} )
    },
    //
    addFilter (e) {
      // sortable hack...
      e.item.remove() // will be added by v-for instead

      let filter = e.clone.obj // <- the dropped filter Object

      // c) Update ONLY fields, directly
      let art = {
        // Nonentities (must be extended?)
        id: this.value.id,
        imageData: extend({}, {val: filter.imageData}).val,
        pixels : extend({}, {val: filter.pixels}).val,
        // Entities
        filters: this.value.filters,
        palette: filter.palette,
        bitmap: filter
      }
      art.filters.push(filter)
      this.$store.dispatch('updateFields', {artworks: [art]} )


      // a) update entity directly from this component
      // let tmp = extend({}, {val: this.value}).val
      // tmp.filters.push(filter)
      // tmp.imageData = extend({}, {val: filter.imageData}).val
      // tmp.pixels = filter.pixels
      // tmp.palette = filter.palette
      // tmp.bitmap = filter
      // this.$store.dispatch('updateEntities', {artworks: [tmp]} )
      // // update Preview
      // this.__updatePreview(tmp.imageData)

      // or b) Update entity via parent's "model" directive
      // this.$emit('input', tmp)
    },

    //
    __init() {
      this.slidingLower = new Array(65536).fill(0)
      //this.slidingCurrent = new Array(65536).fill(0)
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

      ////this.slidingCurrent = this.myValue.slidingCurrent

      this.__populateSlidingSpeeds()

      // LAST_TIME = Date.now()
      this.controlPower = 0
      this.controlTargetPower = 0
      this.controlActualPower = 0

      this.slidingStarted = true
      this.slidingAnimId = requestAnimationFrame(this.__animateSliding)
    },

    __stopSliding() {
      if (!this.slidingStarted) return
      console.log('__stopSliding')

      // Store sliding current with entity
      let art = {
        rem: 'Stop Sliding',
        id: this.myValue.id,
        slidingCurrent: SLIDING_CURRENT
      }
      this.$store.dispatch('updateFields', {artworks: [art]} )
      //this.myValue.slidingCurrent = this.slidingCurrent
      this.slidingStarted = false
      cancelAnimationFrame(this.slidingAnimId)

    },

    // __dragLever() {
    //   this.__computeSlidingSpeed(this.controlTargetPower);
    // },

    __animateSliding(TIME) {

      // ELAPSED_TIME = TIME - LAST_TIME
      // LAST_TIME = TIME

      // smoothy
      this.controlActualPower += (this.controlTargetPower - this.controlActualPower) * .1 //* ELAPSED_TIME/1000
      // this.controlActualPower = this.controlTargetPower

      // console.log(ELAPSED_TIME, this.controlActualPower, this.controlTargetPower)
      this.__computeSlidingSpeed(this.controlActualPower)

      SLIDING_CURRENT = (this.controlDirection > 0)
        ? crunch.add(SLIDING_CURRENT, this.slidingSpeed)
        : crunch.sub(SLIDING_CURRENT, this.slidingSpeed)

      // recCounter++;
      if (SLIDING_CURRENT.length > 65536) {

        SLIDING_CURRENT.shift(1);

        console.log('too high beep!')
        //oRangeDisplay.val(oRangeDisplay.val() + " \n " + " Stopping @ " + (controlDirection > 0 ? "UPPER":"LOWER") );
        // this.__stopSliding();

      }

      let theColor, mappedIndex

      let tmp = new ImageData(256,256)
      //tmp.data.fill(125)
      for (var i=0; i<65536; i++ ) {
        //  mappedIndex = (slidingMap[i*2] + 256*slidingMap[i*2+1]) *4 ;  // *2=x,y *4 = R,G,B,A
        mappedIndex = i * 4;
        try {
          theColor = this.myValue.palette.colors[SLIDING_CURRENT[i]];

          tmp.data[mappedIndex] = theColor.r; //*4 =*4 =*4 =*4 = !! NB!!!
          tmp.data[mappedIndex+1] = theColor.g;
          tmp.data[mappedIndex+2] = theColor.b;
          tmp.data[mappedIndex+3] = 255;
        } catch(e) {
          console.log('error', this.myValue.palette.colors, theColor, SLIDING_CURRENT[i], i)
          console.log(i, SLIDING_CURRENT[i], SLIDING_CURRENT.length);
          this.__stopSliding()
          return;
        }
      }
      // this.slidingImageData = tmp
      // update Preview
      this.__updatePreview(tmp)

      // DEBUG
      //
      // var position = "";
      // for (var p=0;p<256;p+=32) {
      //   position+=(slidingCurrent[p*256+p]+"-");
      // }
      // oRangeDisplay.val(position + "\n Power: " + controlPower + "\nRate: " + slidingSpeedPower); 	// readout

      // 2. Continue @ANIM
      //
      this.slidingAnimId = requestAnimationFrame(this.__animateSliding);
    },

    __computeSlidingSpeed(pow) {

	    // val should be (currently) from -10,000 to +10,000

      // 1. Calculate speed
      //
      this.controlDirection = (pow > 0) ? 1 : -1;
      this.controlPower = Math.abs(pow);

      // original method:
      //
      // this.slidingSpeedPower = parseInt( ((65536 )*this.controlPower/10000) ) ;
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
  mounted () {
    this.myCtx = this.$refs.preview.getContext('2d')

  },
  created () {
    this.__init()
  },
  beforeDestroy () {
  }
}
</script>
<style lang="stylus">
  .dark-example
    background #333
</style>