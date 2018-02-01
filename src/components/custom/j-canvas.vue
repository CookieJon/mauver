
<template>
<div :style="styleComponent">
  <canvas ref="canvas" :width='myPixelWidth' :height='myPixelHeight'></canvas>
  <!-- // {{ imageData.data.length }} -->
</div>
</template>

<script>
/* eslint-disable */
import { extend } from 'quasar'
import MoeUtils from '../../moe/utils/moe.utils.js'

export default {
  name: 'j-canvas',
  props: {
    width: {  // display width
      type: String,
      default: '100%'
    },
    height: { // display height
      type: String,
      default: '100%'
    },
    pixelWidth: { // canvas pixels
      type: Number,
      default: 256
    },
    pixelHeight: { // canvas pixels
      type: Number,
      default: 256
    },
    imageData: {
      type: ImageData
    },
    // OR
    bitmap: {
      type: Object
    },
    showPalette: {
      type: Boolean,
      default: false
    },
    // OR
    image: {
      type: Image
    }
  },
  components: { },
  computed: {
    styleComponent () {
      return {
        width: this.width,
        height:  this.showPalette ? this.height * 2 : this.height
      }
    },
    myPixelHeight () {
      return this.showPalette ? 512 : 256
    }
  },
  watch: {
    imageData (newVal, oldVal) {
      console.log('** canvas watch imageData **', newVal)
      this.$nextTick(function () {
        this.updateImage()
      })
    },
    bitmap (newVal) {
      // {pixels: [], colors: []}
      console.log('** canvas watch bitmap **', newVal)
      const imgData = MoeUtils.imageDataFromPixelsAndColors(newVal)
      if (this.showPalette) {
        const imgDataPalette = MoeUtils.imageDataFromColors(newVal.colors)
        this.$nextTick(function () {
          this.ctx.putImageData(imgData, 0, 0)
          this.ctx.putImageData(imgDataPalette, 0,256)
        })        
      }
      else {
        this.$nextTick(function () {
          this.ctx.putImageData(imgData, 0, 0)
        })
      }

    }
  },
  data () {
    return {
      myImageData: extend({}, this.imageData),
      ctx: null,
      id: 'j-canvas-1',
      myPixelWidth: 256
    }
  },
  methods: {

    updateImage () {
      // Get prop:imageData
      if (this.imageData instanceof ImageData) {
        this.ctx.putImageData(this.imageData, 0, 0)
      }
      else {
        // draw error on canvas
        this.ctx.fillStyle = 'white'
        this.ctx.fillRect(0, 0, 256, 256)
        this.ctx.fillStyle = 'red'
        this.ctx.font = '30px Comic Sans MS'
        this.ctx.textAlign = 'center'
        this.ctx.fillText('No\nImageData', 128, 128)
      }
      // Set local:myImageData
      this.myImageData = this.ctx.getImageData(0, 0, this.pixelWidth, this.pixelHeight)
    },
    // get canvas FROM...
    fromImageData (imageData) {
      // this.myImageData = imageData
      // this.updateImage()
    },
    fromRGBA (rgba) { // @rgba = UInt8Array
      for (var i = 0, l = rgba.length; i < l; i++) {
        this.myImageData.data[i] = rgba[i]
      }
      this.updateImage()
    },
    fromImage (img) {
      console.log('j-canvas.fromImage() with ', img)
      this.ctx.drawImage(0, 0, this.pixelWidth, this.pixelHeight)
      this.imageData = this.ctx.getImageData(0, 0, this.pixelWidth, this.pixelHeight)
      this.updateImage()
    },
    // GET from canvas...
    getCanvas () {
      return this.$refs.canvas
    },
    getImageData () {
      return this.myImageData
    },
    getImage () {
      return null
    },
    getRGBA () {
      return null
    }
  },
  ready () {
    this.test1 = 'test1'
  },
  mounted () {
    this.ctx = this.$refs.canvas.getContext('2d')
    this.myImageData = this.ctx.getImageData(0, 0, this.pixelWidth, this.pixelHeight)
  }
}
</script>

<style lang="stylus">
  canvas
    width 100%
    height 100%
</style>
