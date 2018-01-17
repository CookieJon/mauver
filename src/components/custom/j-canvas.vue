<template>
<div :style="styleComponent">
  <canvas ref="canvas" :width='pixelWidth' :height='pixelHeight'></canvas>
  <!-- // {{ imageData.data.length }} -->
</div>
</template>

<script>
import { extend } from 'quasar'

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
    image: {
      type: Image
    }
  },
  components: { },
  computed: {
    styleComponent () {
      return {
        width: this.width,
        height: this.height
      }
    }
  },
  watch: {
    imageData (oldVal, newVal) {
      console.log('** canvas watch imageData **', newVal)
      this.updateImage()
      // this.$nextTick(function () {
      //   this.updateImage()
      //   // console.log(this.$el.textContent) // => 'updated'
      // })
    }
  },
  data () {
    return {
      myImageData: extend({}, this.imageData),
      ctx: null,
      id: 'j-canvas-1'
    }
  },
  methods: {
    // Update from imageData
    updateImage () {
      console.log('** canvas update from imageData **')
      this.ctx.putImageData(this.imageData, 0, 0)
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
