/*!
 * moe.object.bitmap v0.0.1
 * (c) 2016 CookieJon
 * Released under the MIT License.
 * https://github.com/CookieJon
 */

 /* eslint-disable */

export default Bitmap

var iq = require('image-q')
var crunch = require("number-crunch");

import ColorUtils from '../../moe/utils/moe.utils.color.js'

import { Utils } from 'quasar'
let x = [10, 123, 21, 127];


function Bitmap (options) {
  options = Object.assign({
    // defaults go here
  }, options)
  this.options = options

  this._type = 'Bitmap'
  this.title = 'Untitled'
  this.id = null

  this.src = null

  this.width = null //     256
  this.height = null // x   256
  this.length = null // = 65535

  this.pixels_key = [] // Original pixels
  this.palette_key = [] // Original palette
  // this.imageData_key = null // context.getImageData(0,0,this.width, this.height).data

  this.pixels = [] // Uint8Array[.length]   Output/used pixels ?>??  needed?
  this.palette = [] // Uint8Array[256]     Output/used palette

  // this.image = null // for loading image and copying to canvas
  // this.canvas = document.createElement('canvas') // for generating imageData (only available w. canvas!)
  this.imageData = null

  this.stats = {
    tags: null,
    colors: null,
    noiseLevel: null,
    average: null,
    high: null,
    low: null
  }
}

Bitmap.prototype = {

  constructor: Bitmap,

  // 
  add (v) {
    let y = [4, 211, 176, 200];
    this.pixels_key = crunch.add(this.pixels_key, v);
    console.log(x)

  },

  init (options) {

    this.options = options
    this.id = options.id

    var self = this

    //  Create from file
    //
    if (options.file) {
      var file = options.file
      // Any old image file
      //
      if (file.type.match(/image.*/)) {
        let img = document.createElement('img')
        img.onload = () => {
          window.URL.revokeObjectURL(this.src)
          self.normalisePalette(img)
        }
        img.src = window.URL.createObjectURL(options.file)
      }
      // File 2. Proprietary JBitmap file
      //
      else {

      }
    }

    // Create from http src
    //
    else if (options.src) {
      // Any old image file from http://
      //
      let img = document.createElement('img')
      img.onload = () => {
        self.title = 'Welcome Aboard'
        setTimeout(function() {
          self.normalisePalette(img)
          // self.image = img
        }, 1);

      }
      img.src = options.src
    }

  },

  normalisePalette (img) {

    if (1 == 1) {
      // * scale img to 256x256 via canvas
      let canvas = document.createElement('canvas')
      canvas.width = 256
      canvas.height = 256
      let ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, 256, 256)
      
     // this.imageData = Utils.extend(true, {}, ctx.getImageData(0, 0, 256, 256))
      // let imgData = ctx.getImageData(0, 0, 256, 256)

      // * material colors
      var colorFrom = parseInt(Math.random() * 150)
      var colorTo = parseInt(Math.random() * 150) + 151
      colorFrom = 0
      colorTo = 255
      var materialColors = ColorUtils.getMaterialColors(colorFrom, colorTo)
      this.palette_key = materialColors
      console.log('material colors used:', materialColors)
      // * iq.palette <= material colors
      var iqPalette = new iq.utils.Palette()
     
      for (var j = 0, l = materialColors.length; j < l; j++) {
        var color = materialColors[j]
        iqPalette.add(iq.utils.Point.createByRGBA(color.r, color.g, color.b, color.a))
      }
      // * iq.distance.?
      var iqDistance = new iq.distance.EuclideanRgbQuantWOAlpha()
      //     return new iq.distance.Euclidean();Manhattan();IEDE2000(); etc...

      // & iq.image.?
      var inPointContainer = iq.utils.PointContainer.fromHTMLCanvasElement(canvas)
      // ////// var iqImage = new iq.image.ErrorDiffusionArray(iqDistance, iq.image.ErrorDiffusionArrayKernel.SierraLite)
      var iqImage = new iq.image.NearestColor(iqDistance)

      var outPointContainer = iqImage.quantize(inPointContainer, iqPalette)
      var uint8array = outPointContainer.toUint8Array()
      console.log(uint8array)
      
      var imageData = canvas.getContext('2d').getImageData(0, 0, 256, 256)
      // Utils.extend(true, this.imageData, imageData)
      this.imageData = new ImageData(256, 256)
     //this.imageData.data.set(data)
      for (var i = 0; i < uint8array.length; i++) {
        this.imageData.data[i] = uint8array[i]
      }
      // tags

      // draw palette
      var paletteCanvas = ColorUtils.drawPixels(iqPalette.getPointContainer(), 16, 32)
      paletteCanvas.className = 'palette'
      //this.$el.appendChild(paletteCanvas)

      // Create pixels array from imageData
      this.pixels_key = []
      //this.palette_key.forEach(c=>console.log(c.r + ' ' + c.g + ' ' + c.b))
      for (var i = 0; i < this.imageData.data.length; i+=4) {
        var index = this.palette_key.findIndex(c=>
          {
            return c.r === this.imageData.data[i] &&
            c.g === this.imageData.data[i+1] &&
            c.b === this.imageData.data[i+2]
          })
        this.pixels_key.push(index)
        this.pixels.push(index)
      }
      console.log("pixels_key", this.pixels_key)

    } else {
      // no transform palette
      let canvas = document.createElement('canvas')
      canvas.width = 256
      canvas.height = 256
      let ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, 256, 256)
      this.imageData = ctx.getImageData(0, 0, 256, 256)
      return
    }

  },

  fromArrayBuffer (srcArrayBuffer) {
    // bitmap stream
    var dataview = new DataView(srcArrayBuffer)
    var offBits = dataview.getUint16(10, true)
    this.width = dataview.getUint32(18, true)
    this.height = dataview.getUint32(22, true)
    var bitCount = dataview.getUint16(28, true)
    // var totalColors = dataview.getUint16(46, true)
    var usedColors = dataview.getUint16(50, true)

    // pixels
    this.length = this.width * this.height
    this.pixels_key = new Uint8Array(this.length)
    for (var y = 0; y < 256; y++) {
      for (var x = 0; x < 256; x++) {
        this.pixels_key[x + y * 256] = dataview.getUint8(offBits + x + (255 - y) * 256) // Invert Y axis (BMP8 data goes from bottom->top)
      }
    }
    this.pixels = Uint8Array.from(this.pixels_key)

    // palette
    var length = bitCount === 0 ? 1 << bitCount : usedColors
    // var index = 54
    var tmpPalette = []
    for (var i = 0; i < length; i++) {
//      var b = dataview.getUint8(index++)
//      var g = dataview.getUint8(index++)
//      var r = dataview.getUint8(index++)
//      var a = dataview.getUint8(index++)

      // tmpPalette.push(Palette.getColorFromRGBA(r, g, b, a))
    }
    this.palette_key = tmpPalette
    this.palette = Array.from(tmpPalette)

    return this
  },

  fromFile (srcFile, callback) {
    var file = srcFile
    var reader = new FileReader()
    var title = file.name.replace(/\.bmp|_/g, '').toSentenceCase()
    var bitmap = this(function (reader, title) {
      reader.addEventListener('load', function (e) {
        bitmap.fromArrayBuffer(e.target.result)
        bitmap.title = title
        bitmap.init()
        callback(bitmap)
      }, false)
      reader.readAsArrayBuffer(file) // for BMP8 raw file
      // reader.readAsDataURL(file)  // for Image() object
    })(reader, title)

    return this
  },
  //this function is called when the input loads an image
  // renderImage (file) {
  //   var reader = new FileReader();
  //   reader.onload = function(event){
  //     the_url = event.target.result
  //     //of course using a template library like handlebars.js is a better solution than just inserting a string
  //     $('#preview').html("<img src='"+the_url+"' />")
  //     $('#name').html(file.name)
  //     $('#size').html(humanFileSize(file.size, "MB"))
  //     $('#type').html(file.type)
  //   }

  //   //when the file is read it triggers the onload event above.
  //   reader.readAsDataURL(file);
  // },
  // fromFileName (filename, callback) {
  fromFileName (filename, callback) {
    // Load bitmap programatically
    //
    var oReq = new XMLHttpRequest()
    oReq.open('GET', filename, true)
    oReq.responseType = 'arraybuffer'
    oReq.onload = function (oEvent) {
      var arrayBuffer = oReq.response // Note: not oReq.responseText
      if (arrayBuffer) {
        // var byteArray = new Uint8Array(arrayBuffer)
        var bitmap = new Bitmap().fromArrayBuffer(arrayBuffer)
        bitmap.title = filename.slice(-8).replace(/\.bmp|_/g, '').toSentenceCase()
        bitmap.init()
        callback(bitmap)
      }
    }
    oReq.send(null)
  },

  // OUTPUT
  //
  render () {
    this.generateImageData(this.pixels, this.palette, this.imageData)
  },

  generateImageData (pixels) {
    // quick method just for the key image with no mapping etc.
    //
    var data = this.imageData.data

    var mapToIndex = 0

    for (var i = 0; i < 65535; i++) {
      var theColor = this.palette_key[pixels[i]]
      data[mapToIndex++] = theColor.r
      data[mapToIndex++] = theColor.g
      data[mapToIndex++] = theColor.b
      data[mapToIndex++] = 255
    }

    return this.imageData
  },

  // Converts image to canvas; returns new canvas element
  convertImageToCanvas (image) {
    var canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    canvas.getContext('2d').drawImage(image, 0, 0)

    return canvas
  },

  // Converts canvas to an image
  convertCanvasToImage (canvas) {
    var image = new Image()
    image.src = canvas.toDataURL('image/png')

    return image
  }

}

