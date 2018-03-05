<template lang="pug">

  div
    //- PREVIEW
    j-panel(icon='business', :title='value.name + " Preview"', :width='400', :height='400', :x='770', :y='10')
      div.j-tray.area.panel-item-grow(slot='content')
        div.row
          div(:class='value.options.frame')
            div.picture-mat
              div.picture-art
                canvas(ref='preview', @click="clickPreview", width='256', height='256', style='width:100%;height:100%;')
                //- j-canvas.frame-type-grid(:image-data='filterFinalImageData')

    //- SETTINGS
    j-panel(icon='business', :title='value.name',
      :width='400', :height='800', :x='350', :y='10')
      div.j-tray.area.panel-item-grow(slot='content')
        div.row

          div.col

            // BITMAP
            q-card(color='dark')
                q-card-main
                  div.row
                    j-lever(v-model='controlTargetPower', rest='50%', :markers='true',
                      :labelAlways='true',
                      orientation='vertical',
                      @start='__startSliding',
                      @stop='__stopSliding',
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
                  div.row
                    div.col
                      |BITMAP
                      div.row.no-wrap
                        // Bitmap
                        j-drop-target(:value='myBitmap', @add='dropBitmap($event)', style='width:80px;height:80px;')
                        //- j-canvas(:value='bitmapFilterOutput.colors', style='width:80px;height:80px;')

                    div.col
                      |PALETTE
                      div.row.no-wrap
                        // Art Palette
                        j-drop-target(:value='myPalette', @add='dropPalette($event)', style='width:80px;height:80px;')
                        j-canvas(:value='paletteFilterOutput', style='width:80px;height:80px;')
                  div.row.gutter-xs
                    div.col-6
                      q-select(dark, v-model='paletteDDL', :options='paletteOptions')
                      q-toggle(v-model="myValue.options.useNewPalette", label='Active')
                      q-toggle(v-model="myValue.options.remapBitmapToPalette", label='Remap Bitmap')
                    div.col-6
                      q-select(dark, v-model='myValue.options.frame', :options='frameOptions')
                      q-select(dark, v-model='myValue.options.aspect', :options='aspectOptions')

            // SPEEDMAP
            q-card(color='dark')
                q-card-main
                  div.col
                    |SPEEDMAP

                    div.row
                      div.col-9
                        div.row
                          div.col
                            //- q-select(dark, v-model='slidingSpeedsPattern', :options='presetSlidingSpeedOptions')
                            q-input.col(stack-label='Sliding Speeds Pattern', dark, v-model='slidingSpeedsPattern')
                          div.col

                            q-btn(small,push,ref='target')|?
                              q-popover(ref='popover')
                                q-list(separator,link,style="min-width: 100px")
                                  q-item(
                                    v-for="(n, i) in presetSlidingSpeedOptions",
                                    :key='i',
                                    @click='slidingSpeedsPattern=presetSlidingSpeedOptions[i].value,$refs.popover.close()')
                                    q-item-main(:label='n.label')
                        div.row
                          q-toggle(v-model="myValue.options.slidingLocked", label='Lock')
                          q-btn(small,push,ref='target',@click='changePeriod(-1)')|<
                          q-btn(small,push,ref='target',@click='changePeriod(1)')|>
                          q-btn(small,push,ref='target',@click='changeAmplitude(1)')|+
                          q-btn(small,push,ref='target',@click='changeAmplitude(-1)')|-
                          //- q-input.col(readonly,stack-label='started', dark, v-model='slidingStarted')
                          //- q-input.col(stack-label='Control Target Power', dark, v-model='controlTargetPower')
                      //- div.row
                      //-   q-input.col(stack-label='Control Power', dark, v-model='controlPower')
                      //-   q-input.col(stack-label='Sliding Speed Power', dark, v-model='slidingSpeedPower')
                      div.col-3
                        j-canvas(:value='paletteFilterOutput', style='width:80px;height:80px;')

            // PXL MAP
            q-card(color='dark')
                q-card-main
                  div.row
                    div.col
                      |PIXELMAP
                      div.row.no-wrap
                        div.col-3
                          // pixelMapInput
                          j-drop-target(:value='pixelMapInput', @add='dropPixelMapInput($event)', style='width:80px;height:80px;')
                          //- j-drop-target(:value='goboFrame', @add='dropGoboFrame($event)', style='width:80px;height:80px;')
                          //- j-canvas(:value='bitmapFilterOutput.colors', style='width:80px;height:80px;')
                        div.col-3
                          q-toggle(v-model="myValue.options.unmapPixelMap", label='Unmap')
                          q-toggle(v-model="myValue.options.mapPixelMap", label='Map')
                        div.col-3
                          q-toggle(v-model="myValue.options.unmapPixelMapSpeed", label='Unmap Speed')
                          q-toggle(v-model="myValue.options.mapPixelMapSpeed", label='Map Speed')

            // GOBO
            q-card(color='dark')
                q-card-main
                  div.row
                    div.col
                      |GOBO
                      div.row.no-wrap
                        // Bitmap
                        //- j-drop-target(:value='gobo', @add='dropGobo($event)', style='width:80px;height:80px;')
                        //- j-drop-target(:value='goboFrame', @add='dropGoboFrame($event)', style='width:80px;height:80px;')
                        //- j-canvas(:value='bitmapFilterOutput.colors', style='width:80px;height:80px;')


    </q-card-main>
  </q-card-media>

</template>

<script>
/* eslint-disable */
// import Utils from '../../utils'
// import { Utils } from 'quasar'
// import { Platform } from 'quasar'
// const TWEEN = require('es6-tween')

import {QPopover, QList, QItem, QItemMain, QToggle, QOptionGroup, QBtn, QCard, QCardMain, QCardSeparator, QCardMedia, QCardTitle, QField, QInput, QSelect} from 'quasar'
var jLever = require('components/custom/j-lever')
var jCanvas = require('components/custom/j-canvas')
var jCollection = require('components/custom/j-collection')
var jDropTarget = require('components/custom/j-droptarget')
import Sortable from 'sortablejs'
import { extend } from 'quasar'
var crunch = require("number-crunch");
import ColorUtils from '../../moe/utils/moe.utils.color.js'
import MoeUtils from '../../moe/utils/moe.utils.js'

let UID = 10

let
  CURRENT_TIME,
  LAST_TIME = Date.now(),
  ELAPSED_TIME

let
  SLIDING_PIXELS,
  SLIDING_COLORS

export default {
  name: "j-artwork",
  components: {
    jCanvas, jLever, jCollection, jDropTarget,
    QPopover, QList, QItem, QItemMain, QToggle, QOptionGroup, QBtn, QCard, QCardMain, QCardSeparator, QCardMedia, QCardTitle, QField, QInput, QSelect
  },
  props: {
    value: {
      type: Object  // 'moe.objects.artwork' (so far)
    }
  },
  data () {
    return {
      paletteOptions: ColorUtils.presetPalettes.map(v=>{return {'label':v, 'value':v}}),
      frameOptions: [
        {label: 'Classic', value:'picture-frame-classic'},
        {label: 'Modern', value:'picture-frame-modern'},
        {label: 'Minimal', value:'picture-frame-minimal'},
        {label: 'None', value:'picture-frame-none'}
      ],
      aspectOptions: [
        {label: 'Square', value:'picture-aspect-square'},
        {label: 'Portrait', value:'picture-aspect-portrait'},
        {label: 'Landscape', value:'picture-aspect-landscape'}
      ],
      presetSlidingSpeedOptions: [
        '1,2,3,2,1,1,1,1,1,2,3,2',
        '1,1,1,1,1,1,1,1,1,1,1,2,3,4,5,4,3,2,3,4,5,6,7,6,5,4,3,4,5,6,5,4,3,2',
        '1,2,3,4,5,6,7,8,9,8,7,6,5,4,3,2',
        '1,2,3,2,1,2,3,4,5,4,3,2,1,2,3,4,5,6,7,8,9,8,7,6,5,6,7,8,9,10,11,12,13,14,13,12,11,10,9,8,9,10,11,12,11,10,9,8,9,10,11,10,9,8,7,6,7,8,9,8,7,6,5,6,7,8,9,8,7,6,5,4,3,4,5,6,7,8,7,6,5,4,5,6,7,6,5,4,3,2,1',
        '1,2,2,4,4,4,4,4,4,4,4,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8',
        '1,2,3,4,3,5,6,7,8,9,10,9,8,7,6,5,4,5,6,7,8,9,8,7,6,7,8,9,10,11,12,13,14,15'
      ].map(v=>{return {label:v.slice(0,30), value:v}}),

      frameDDL: null,
      paletteDDL: null,
      // myValue: null,

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
      // imageData: null,

      pixelMapInput: null,  // greyscale source for generating a pixelmap


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
        debug () {
      try {
        let a = ' '
        return this.myValue.bitmap.pixels.slice(-8)
      } catch(e) {
        return 'not defined'
      }

    },
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
    },


    // COMPUTED PROPS ON THE FLY: READ  https://jsfiddle.net/Linusborg/3p4kpz1t/
    //
    bitmapFilterOutput () {

      let output = {
        pixels: this.value.bitmap ? Array.prototype.slice.call(this.value.bitmap.pixels) : undefined,
        colors: this.value.bitmap ? this.value.bitmap.palette.colors.slice() : this.value.palette.colors
      }

      console.log("COMPUTED bitmapOutput")
      return output
    },
    // ===>>
    paletteFilterOutput () {
      const input = this.bitmapFilterOutput

      let output = {
        pixels: input.pixels ? Array.prototype.slice.call(input.pixels) : undefined,
        colors: input.colors ? input.colors.slice() : undefined
      }


      const oUseNewPalette = this.value.options.useNewPalette
      const oRemapBitmapToPalette = this.value.options.remapBitmapToPalette

      if (oUseNewPalette) {

        let bitmapColors = input.colors // Just in case

        ////output.colors =   Array.prototype.slice.call(this.value.palette.colors)
        output.colors = JSON.parse(JSON.stringify(this.value.palette.colors))

        if (oRemapBitmapToPalette) {
          // Remap bitmap to palette
          let paletteColors = output.colors
          let map = bitmapColors.map(b => {
            let m2 = paletteColors.findIndex(p => {return p.id === b.id})
            return m2 > -1 ? m2 : 0
          })
          console.log('MAP =>', bitmapColors.map(c=>c.name))
          console.log('MAP =>', paletteColors.map(c=>c.name))
          console.log('MAP =>', map)
          for (let i = 0; i < input.pixels.length; i++) {
            output.pixels[i] = map[input.pixels[i]]
          }

        }

      }


      // UNMAP PIXEL MAP!
      if (this.value.options.unmapPixelMap && output.pixels) {
        let tmpPixels = output.pixels.slice()

        for (var i=0; i<65536; i++ ) {
          output.pixels[i] = tmpPixels[this.value.pixelmap[i*2]+256*this.value.pixelmap[i*2+1]];
        }

      }

      output.id = this.uid++
      console.log("COMPUTED paletteFilterOutput", output)
      return output
    },
    // ===>>
    sliderFilterOutput() {
      // 2. Sliding Progress
      // 3.
      const input = this.paletteFilterOutput

      let output = {
        pixels: input.pixels ? Array.prototype.slice.call(input.pixels) : undefined,
        colors: input.colors ? input.colors.slice() : undefined
      }

      console.log("SLIDER INPUT WAS", input)
      if (input.pixels.length != 65536) alert(input.pixels.length)


      return input

    },

    // ===>> BITMAP ==> PALETTE ===>
    filterFinalImageData() {

      const input = extend(true, {},this.paletteFilterOutput)

      // Preview Image &
      // ImageData
      let imgData = new ImageData(256,256)
      try {
        for (var i=0; i<65536; i++ ) {
          let mappedIndex = i * 4;
          let theColor = input.colors[input.pixels[i]]
          // if (!theColor) console.log('NO COLOR @'+i, SLIDING_PIXELS, SLIDING_PIXELS[i], v.palette.colors)
          imgData.data[mappedIndex] = theColor.r
          imgData.data[mappedIndex+1] = theColor.g
          imgData.data[mappedIndex+2] = theColor.b
          imgData.data[mappedIndex+3] = 255;
        }
      } catch(e) {
        console.warn('Render error:', e)
      }

      console.log("COMPUTED filterFinalImageData")
      this.$nextTick(() => {
      //  this.myCtx.putImageData(imgData,0,0)
      })

      // this.$emit('input', this.myValue)
      return imgData

    },



    imageData() {
      console.log("COMPUTED imageData")
      // this.$emit('input', this.myValue)
      let a = this.filterFinalImageData
      return a
    },
    myValue() {
      let val = extend({}, {val: this.value}).val
      return val
    }


  },
  watch: {
    // value: {
    //   handler: function (val, oldVal) {
    //     console.log("WATCH ==> artwork.value", val, oldVal)
    //     if (!oldVal || val.id != oldVal.id) {
    //       console.log('Different artwork.value!')
    //       let imgData = new ImageData(256,256)
    //       if (this.myCtx) this.__updatePreview(imgData)
    //     }
    //     this.myValue = extend({}, {val}).val
    //     this.render()
    //   },
    //   immediate: true
    // },
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
    // paletteDDL(newValue, oldValue) {
    //   // var newPalette = ColorUtils.GeneratePaletteColors(newValue)
    //   // console.log('GENERATED:', newPalette)
    //   // this.$state.activeBitmap.palette  = newPalette
    // },
    paletteDDL(newValue) {
      const colors = ColorUtils.GeneratePaletteColors(newValue)

      //this.debugColors(colors)

      // generate imageData
      let imageData =  MoeUtils.imageDataFromColors(colors)

      // return palette
      let pal = {
        id: UID++,
        colors,
        imageData
      }
      let art = {
        id: this.value.id,
        palette: pal
      }
      this.$store.dispatch('updateFields', {artworks: [art]} )
    }
  },
  methods: {
    clickPreview(e) {
      let
        x = parseInt(e.offsetX / e.target.offsetWidth * 256),
        y = parseInt(e.offsetY / e.target.offsetHeight * 256)

      console.log('Clicky ' + x + ', ' + y)

    },

    changePeriod(amt) {
      let pattern = this.slidingSpeedsPattern.split(',')
      pattern = pattern.reduce(function(result, element, i) {
        if (amt===1) {
          result.push(element)
          result.push(element)
        } else {
          if (i%2==0) {
            result.push(element)
          }
        }
        return result
      }, [])
      this.slidingSpeedsPattern = pattern.join(',')
    },
    changeAmplitude(amt) {
      let pattern = this.slidingSpeedsPattern.split(',')
      pattern = pattern.reduce(function(result, element, i) {
        if (amt===1) {
          result.push(element*2)
        } else {
          if (i%2==0) {
            result.push(parseInt(element/2))
          }
        }
        return result
      }, [])
      this.slidingSpeedsPattern = pattern.join(',')
    },

    onUpdate (e) {
      let tmp = extend({}, {val: this.myValue}).val
      this.$emit('input', tmp)
    },

    __updatePreview(imgData) {

      this.myCtx.putImageData(imgData,0,0)
    },

    configurePalette() {

    },
    dropPalette(e) {
      console.log('dropPalette')
      e.item.remove() // will be added by v-for instead
      let art = {
        id: this.value.id,
        palette: e.clone.obj
      }
      this.$store.dispatch('updateFields', {artworks: [art]} )
    },
    dropBitmap(e) {
      console.log('dropBitmap')
      e.item.remove() // will be added by v-for instead
      let art = {
        id: this.value.id,
        bitmap:  e.clone.obj
      }
      this.$store.dispatch('updateFields', {artworks: [art]} )
    },
    dropPixelMapInput(e) {
      console.log('dropPixelMapInput')
      e.item.remove() // will be added by v-for instead
      this.pixelMapInput = e.clone.obj
      let pixelsIn = this.pixelMapInput.pixels
      let mapOut = []
      for (let i = 0; i< 256; i++) {
        for (let y = 0; y < 256; y++) {
          for (let x = 0; x < 256; x++) {
            let offset = x + y * 256
            if (pixelsIn[offset] === i) {
              mapOut.push(x)
              mapOut.push(y)
            }
          }
        }
      }

      console.log('PROCESSED MAP: ', mapOut)
      let art = {
        id: this.value.id,
        pixelmap:  mapOut
      }
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

      // pixelmap => Sliding speeds
      if (this.value.options.mapPixelMapSpeeds) {
        let tmp = []
        for (let i=0; i < 65536; i++) {
          tmp.push (this.slidingSpeeds[i*2] + 256 * [i*2+1])
        }
        this.slidingSpeeds = tmp
      }



    },



    __startSliding() {

      SLIDING_PIXELS = this.sliderFilterOutput.pixels
      SLIDING_COLORS = this.sliderFilterOutput.colors

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
        slidingCurrent: SLIDING_PIXELS
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

      SLIDING_PIXELS = (this.controlDirection > 0)
        ? crunch.add(SLIDING_PIXELS, this.slidingSpeed)
        : crunch.sub(SLIDING_PIXELS, this.slidingSpeed)



      // mappedIndex = (slidingMap[i*2] + 256*slidingMap[i*2+1]) *4 ;  // *2=x,y *4 = R,G,B,A

      // try {
      //   theColor = theBitmap.palette[slidingCurrent[i]];
      //   slidingImageData.data[mappedIndex] = theColor.blue; //*4 =*4 =*4 =*4 = !! NB!!!
      //   slidingImageData.data[mappedIndex+1] = theColor.green;
      //   slidingImageData.data[mappedIndex+2] = theColor.red;
      // } catch(e) {
      //   console.log(i, slidingCurrent[i], slidingCurrent.length);
      //   stopSliding();




      // recCounter++;
      if (SLIDING_PIXELS.length > 65536) {

        SLIDING_PIXELS.shift(1);

        console.log('too high beep!')
        //oRangeDisplay.val(oRangeDisplay.val() + " \n " + " Stopping @ " + (controlDirection > 0 ? "UPPER":"LOWER") );
        // this.__stopSliding();

      }

      let theColor, mappedIndex

      let tmp = new ImageData(256,256)
      //tmp.data.fill(125)
      for (var i=0; i<65536; i++ ) {
        if (this.value.options.mapPixelMap) {
          mappedIndex = (this.value.pixelmap[i*2] + 256 * this.value.pixelmap[i*2+1]) * 4
        } else {
          mappedIndex = i * 4
        }
        try {
          theColor = SLIDING_COLORS[SLIDING_PIXELS[i]];

          tmp.data[mappedIndex] = theColor.r; //*4 =*4 =*4 =*4 = !! NB!!!
          tmp.data[mappedIndex+1] = theColor.g;
          tmp.data[mappedIndex+2] = theColor.b;
          tmp.data[mappedIndex+3] = 255;
        } catch(e) {
          console.log('error', SLIDING_COLORS, theColor, SLIDING_PIXELS[i], i)
          console.log(i, SLIDING_PIXELS[i], SLIDING_PIXELS.length);
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


      if (!this.value.options.slidingLocked) {
        this.slidingSpeedPower = parseInt( ((65536 )*this.controlPower/10000) ) ;
      } else {
        this.slidingSpeedPower = parseInt(this.controlPower/10000 * this.slidingSpeedsGradations) * this.slidingSpeedsLength;

      }

      // original method:
      // this.slidingSpeedPower = parseInt( ((65536 )*this.controlPower/10000) ) ;
      // new method:
      //this.slidingSpeedPower = parseInt(this.controlPower/10000 * this.slidingSpeedsGradations) * this.slidingSpeedsLength;

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

// html
//   background-image linear-gradient(#eee, #aaa)
//   height 100%



  // *****  FRAME CLASSIC  https //codepen.io/chris22smith/pen/PbBwjp
  .picture-frame-classic
    background-color #ddc
    border solid 5vmin #eee
    border-bottom-color #fff
    border-left-color #eee
    border-radius 2px
    border-right-color #eee
    border-top-color #ddd
    box-shadow 0 0 5px 0 rgba(0,0,0,.25) inset, 0 5px 10px 5px rgba(0,0,0,.25)
    box-sizing border-box
    display inline-block
    width  100%
    padding 5vmin
    position relative
    text-align center
    & before
      border-radius 2px
      bottom -2vmin
      box-shadow 0 2px 5px 0 rgba(0,0,0,.25) inset
      content ""
      left -2vmin
      position absolute
      right -2vmin
      top -2vmin

    & after
      border-radius 2px
      bottom -2.5vmin
      box-shadow  0 2px 5px 0 rgba(0,0,0,.25)
      content ""
      left -2.5vmin
      position absolute
      right -2.5vmin
      top -2.5vmin

  .picture-frame-classic > picture-mat
    border solid 2px
    border-bottom-color #ffe
    border-left-color #eed
    border-right-color #eed
    border-top-color #ccb
    max-height 100%
    max-width 100%
  .picture-frame-classic > picture-mat > picture-art
    width 100%
    height 100%






  // *****  FRAME MODERN   https //thinkux.ca/blog/Creating-Framed-Matted-Pictures-Using-CSS/
.picture-frame-modern {
  position: relative;
  width: 100%;
  padding-bottom: 82.5%;
  background: black;
  box-shadow: 0 10px 7px -5px rgba(0, 0, 0, 0.3);
}

.picture-frame-modern .picture-mat {
  position: absolute;
  background: white;
  top: 3.0303%; bottom: 3.0303%; left: 2.5%; right: 2.5%;
  box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.5) inset;
}

.picture-frame-modern .picture-art {
  position: absolute;
  top: 16.129%; bottom: 16.129%; left: 13.158%; right: 13.158%;
}

.picture-frame-modern canvas {
  width: 100%;
}

.picture-frame-modern .picture-art:after {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.5) inset;
}



  // *****  FRAME MINIMAL   https //thinkux.ca/blog/Creating-Framed-Matted-Pictures-Using-CSS/
.picture-frame-minimal {
  position: relative;
  width: 100%;
  padding-bottom: 82.5%;
  background: black;
  box-shadow: 0 10px 7px -5px rgba(0, 0, 0, 0.3);
}

.picture-frame-minimal .picture-mat {
  position: absolute;
  background: white;
  top: 3.0303%; bottom: 3.0303%; left: 2.5%; right: 2.5%;
  box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.5) inset;
}

.picture-frame-minimal .picture-art {
  position: absolute;
  top: 16.129%; bottom: 16.129%; left: 13.158%; right: 13.158%;
}

.picture-frame-minimal canvas {
  width: 100%;
}

.picture-frame-minimal .picture-art:after {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.5) inset;
}


</style>