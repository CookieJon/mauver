<template lang="pug">
<!-- root node required -->
div

  // TESTING
  j-panel(icon='business', title='test canvas',
     :width='300', :height='320', :x='410', :y='510')
    div.j-tray.area.panel-item-grow(slot='content')
      // NB: Required at the moment to load bitmaps from IMG. TODO: Fix!
      canvas(ref='testcanvas', :width=256, :height=256)

  // COLLECTION
  j-panel(icon='business', title='O', :width='300', :height='700', :x='10', :y='10')
    div.j-panel-toolbar.text-black(slot='toolbar', style='padding:4px;')
      q-btn(small,push,icon='art track', @click='addArtwork')
      q-btn(small,push,icon='satellite', @click='openFileInput')
      q-btn(small,push,icon='color lens', @click='addPalette')
    // artworks
    div.j-tray.area.panel-item-grow(slot='content')
      j-collection.frame-type-grid(v-model='artworks', @select='selectArtwork')
    // bitmaps
    div.j-tray.area.panel-item-grow(slot='content')
      j-collection.frame-type-grid(v-model='bitmaps', @select='selectBitmap')
      j-upload-zone(ref='zone',@select='loadImagesFromFiles')
    // palettes
    div.j-tray.area.panel-item-grow(slot='content')
      j-collection.frame-type-grid(v-model='palettes', @select='selectPalette')

  // selectedArtwork SLIDER
  j-panel(v-if='selectedArtwork != null' icon='business', :title='selectedArtwork?selectedArtwork.name:"Art"',
    :width='900', :height='800', :x='350', :y='10')
    div.j-tray.area.panel-item-grow(slot='content')
      j-artwork(v-model='selectedArtwork')

  // selectedBitmapImageData
  j-panel(v-if='selectedBitmapImageData != null', icon='business', title='Selected Bitmap', :width='200', :height='300', :x='110', :y='400')
    div.j-tray.area.panel-item-grow(slot='content')
      j-canvas.frame-type-grid(:image-data='selectedBitmapImageData')

  // selectedPaletteImageData
  j-panel(v-if='selectedPaletteImageData != null', icon='business', title='Selected Palette', :width='200', :height='300', :x='10', :y='400')
    div.j-tray.area.panel-item-grow(slot='content')
      j-canvas.frame-type-grid(:image-data='selectedPaletteImageData')

</template>

<script>
/* eslint-disable */
import { dom, event, openURL, QLayout, QToolbar, QToolbarTitle, QBtn, QIcon, QList, QListHeader, QItem, QItemSide, QItemMain, QSlider} from 'quasar'
import MoeObjects from '../../moe/objects'
import dataColors from '../../data'
import iq from 'image-q'

// CREATE INITIAL DATA
import ColorUtils from 'moe/utils/moe.utils.color.js'
// let pal = colorUtils.getMaterialColors(0,256)
// let palObj = {}
// pal.forEach(v => palObj[v.id] = v)
// console.log('PALETTE', JSON.stringify(pal))

export default {
  name: 'view-mauver',
  components: { QBtn},
  created () {
    // Here we are stubbing the initial data. In the real world, this
    // should be the response from the API Backend.
    const initialData = dataColors
    // console.log('data', dataColors)
    // this.$store.dispatch('addColors', { data: initialData })
    this.$store.dispatch('updateEntities', { colors: initialData })
  },
  data () {
    return {
      selectedPaletteId: null,
      selectedBitmapId: null,
      selectedArtworkId: null,
      uid: 0,
      artId: 0,
      palId: 10,
      bmpId: 0,
      colId: 0
    }
  },
  computed: {
    selectedArtwork: {
      get () {
        return this.$store.getters.getEntityById('artworks', this.selectedArtworkId)
      },
      set (value) {
        this.$store.dispatch('updateEntities', {artworks: [value]})
      }
    },
    selectedBitmap: {
      get () {
        return this.$store.getters.getEntityById('artworks', this.selectedBitmapId)
      },
      set (value) {
        this.selectedBitmapId = value.id
      }
    },
    selectedPaletteImageData () {
    //  let selectedPalette = this.$store.getters['entities/palettes/find'](this.selectedPaletteId)
    //  return selectedPalette != null ? selectedPalette.imageData : null
    return null
    },
    selectedBitmapImageData () {
      let selectedBitmap = this.$store.getters.getEntityById('bitmaps', this.selectedBitmapId)
      return selectedBitmap ? selectedBitmap.imageData : null
    },
    selectedBitmapPaletteImageData () {
   //   let selectedBitmap = this.$store.getters['entities/bitmaps/find'](this.selectedBitmapId)
    //  return selectedBitmap && selectedBitmap.palette ? selectedBitmap.palette.imageData : null
    return null
    },
    palettes: {
      get () {
        // return this.$store.getters['entities/palettes/query']().orderBy('id', 'desc').get()
        return this.$store.getters.getEntities('palettes')
      },
      set() {
        // alert('sorted')
      }
    },
    bitmaps: {
      get () {
         return this.$store.getters.getEntities('bitmaps')
      },
      set() {
        // alert('sorted')
      }
    },
    artworks: {
      get () {
        return this.$store.getters.getEntities('artworks')
      },
      set() {
        // alert('sorted')
      }
    }
  },
  methods: {

    selectPalette(e) {
      console.log('selectPalette', e)
      this.selectedPaletteId = e.item.id

      let objId = this.selectedPaletteId
      //let obj = this.$store.getters['entities/palettes/find'](objId).with('colors')
      let obj = null
      console.log('FETCH PALETTE with ID=' + objId)
      console.log("== ", obj)

    },
    selectBitmap(e) {
      console.log('selectBitmap', e)
      this.selectedBitmapId = e.item.id
    },
    selectArtwork(e) {
      console.log('selectArtwork', e)
      this.selectedArtworkId = e.item.id
    },

    // 1. Invoked from uploadZone@select
    loadImagesFromFiles(files) {
      for (let i = 0; i < files.length; i++) {
        let file = files[i]
        this.loadImageFromFile(file).then((bmp) => {
          console.log("LOADED BMP", bmp)
          this.addBitmap(bmp)
        }).catch((err) => {
          console.log("ERROR!", err)
        })
      }
    },

    // 2. Invoked from loadImagesFromFiles
    loadImageFromFile(file) {
      // One file at a time, please!
      console.log('loadImageFromFile:', file)
      return new Promise((resolve, reject) => {

        // let bmp = {
        //   id: this.bmpId++
        // }

        // A. Custom jBMP
        //
        if (file.size === 66614 && file.name.match(/.bmp/) ) {
          let reader = new FileReader()
          reader.onload = () => {
            let arrayBuffer = reader.result
            let pixPalImagedata = this.bitmapFromArrayBuffer(arrayBuffer)
            let bmp = {
              id: this.bmpId++,
              ...pixPalImagedata
            }
            resolve(bmp)
          }
          reader.readAsArrayBuffer(file) // for BMP8 raw file
        }
        // B. Any other image
        //
        else if (file.type.match(/image.*/)) {
          let reader = new FileReader()
          reader.onload = () => {
            let dataURL = reader.result
            let img = new Image
            img.onload = () => {
              let pixPalImagedata = this.bitmapFromImg(img)
              let bmp = {
                id: this.bmpId++,
                ...pixPalImagedata
              }
              resolve(bmp)
            }
            img.src = dataURL
          }
          reader.readAsDataURL(file) //  for Image() object
        }
        // C. Can't load this file as image
        //
        else {
          reject('Can\'t load. File is not an image!')
        }

      })
    },
    openFileInput() {
      this.$refs.zone.openFileInput()
    },

    addBitmap (bmp) {
      console.log('addBitmap:', bmp)

      this.$store.dispatch('updateEntities', {bitmaps: [bmp]} )
      //this.$store.dispatch('addBitmap', {data: bmp})
      //this.$store.dispatch('entities/bitmaps/insert', {data: bmp})
    },
    addPalette () {
      let pal = ColorUtils.paletteFromPreset('raw')
      console.log('vie - addPalette', pal)
      this.$store.dispatch('updateEntities', {palettes: [pal]})
    },
    addArtwork () {

      let art = {
        id: this.artId,
        name: 'Art '+this.artId++,
        // *artwork's private...'*
        // final output...
        options: {
          useNewPalette: false,
          remapBitmapToPalette: true,
          slidingLocked: true,
          usePixelmap: false,
          unusePixelMap: false
        },

        pixels: Array(65536).fill(120),
        palette: ColorUtils.paletteFromPreset('raw'),
        imageData: null,
        slidingCurrent: [],
        filters: [],
        // 1. artwork components. MUCH TODO:!
        bitmap: undefined,
        pixelmap: null,
        colormap: null,
        slider: null,
        gobo: null
      }
      this.$store.dispatch('updateEntities', {artworks: [art]} )


      //this.$store.dispatch('addArtwork', {data: art})
      //this.$store.dispatch('entities/artworks/insert', {data: art})
    },



    // toggle (todo) {
    //   this.$store.dispatch('entities/todos/update', { id: todo.id, done: !todo.done })
    // },

    // update (id, title) {
    //   this.$store.dispatch('entities/todos/update', { id, title })
    // },

    // destroy (id) {
    //   this.$store.dispatch('entities/todos/delete', id)
    // },

    debugColors(colors) {
      // Debug color list      console.log('Debug colors', colors.length)      let out = '', styles=[]      for (let i=0; i < colors.length; i++) {out += '%c'+i,styles.push('background-color:'+colors[i].hex+';')};console.log("COLORS:");console.log(out, ...styles)
      console.log('Debug colors', colors.length)
    },



    bitmapFromArrayBuffer (srcArrayBuffer) {
      // a. Parse arrayBuffer

      // header
      let dataview = new DataView(srcArrayBuffer)
      let offBits = dataview.getUint16(10, true)
      let width = dataview.getUint32(18, true)
      let height = dataview.getUint32(22, true)
      let bitCount = dataview.getUint16(28, true)
      let totalColors = dataview.getUint16(46, true)
      let usedColors = dataview.getUint16(50, true)

      // pixels
      let length = width * height
      let pixels = new Uint8Array(length)
      for (let y = 0; y < 256; y++) {
        for (let x = 0; x < 256; x++) {
          pixels[x + y * 256] = dataview.getUint8(offBits + x + (255 - y) * 256) // Invert Y axis (BMP8 data goes from bottom->top)
        }
      }

      // palette
      ////let presetColors = this.$store.getters['entities/colors/query']().orderBy('id').get()
      
      let palette = ColorUtils.paletteFromPreset('raw')
      let presetColors = palette.colors.slice()
      palette.colors = []
      let paletteLength = bitCount === 0 ? 1 << bitCount : usedColors
      let index = 54
      for (let i = 0; i < paletteLength; i++) {
        let b = dataview.getUint8(index++)
        let g = dataview.getUint8(index++)
        let r = dataview.getUint8(index++)
        let a = dataview.getUint8(index++)
        let col = presetColors.find(c => {
          return c.r === r && c.g === g && c.b === b
        })
        palette.colors.push(col || presetColors[0]) // TODO: Make real colors!
      }
      this.debugColors(palette.colors)
      // palette's imagedata
      palette.imageData = this.imageDataFromColors(palette.colors)

      // b. generate imageData
      let imageData = new ImageData(width, height)
      let data = imageData.data
      let mapToIndex = 0
      for (let i = 0; i < 65535; i++) {
        let theColor = palette.colors[pixels[i]]
        data[mapToIndex++] = theColor.r
        data[mapToIndex++] = theColor.g
        data[mapToIndex++] = theColor.b
        data[mapToIndex++] = 255
      }

      // Return a bitmap
      let ppid = {
        pixels,
        palette,
        imageData
      }
      return ppid
    },

    bitmapFromImg (img) {
      // NB: IMAGE must have loaded by this  time.
      // Converts a true-color image to 256-color palette & 256x256 pixels
      // imgSrc = [img|dataURL]

      // use dataURL for imgSrc so far
      // * scale img to 256x256 via canvas
      let canvas = document.createElement('canvas')
      canvas = this.$refs.testcanvas
      canvas.width = 256
      canvas.height = 256
      let ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, 256, 256)


//       let img2 = ctx.drawImage(img, 0, 0, 256, 256)
//       let inPointContainer2 = iq.utils.PointContainer.fromHTMLImageElement(ctx.drawImage(img, 0, 0, 256, 256))
//       let inPointContainer = inPointContainer1

      // * material colors
      // TODO: get from a palette, not raw colors
      let materialColors = this.$store.getters.getEntities('colors')

      // * iq.palette <= material colors
      let iqPalette = new iq.utils.Palette()
      for (let j = 0, l = materialColors.length; j < l; j++) {
        let color = materialColors[j]
        iqPalette.add(iq.utils.Point.createByRGBA(color.r, color.g, color.b, color.a))
      }
      // * iq.distance.?
      // iq.distance.Euclidean();Manhattan();IEDE2000(); etc...
      let iqDistance = new iq.distance.EuclideanRgbQuantWOAlpha()

      let inPointContainer = iq.utils.PointContainer.fromHTMLCanvasElement(canvas) // use canvas to scale to 256x256

      let iqImage = new iq.image.ErrorDiffusionArray(iqDistance, iq.image.ErrorDiffusionArrayKernel.SierraLite)
      // let iqImage = new iq.image.NearestColor(iqDistance)

      let outPointContainer = iqImage.quantize(inPointContainer, iqPalette)
      let uint8array = outPointContainer.toUint8Array() // <- imagedata data


      // palette
      let palette = ColorUtils.paletteFromPreset('MaterialDefault')

      // pixels
      let pixels = Array(65536).fill(0) // default all to 0
      let pixelIndex = 0
      console.log('match this!>>', uint8array)

      // Loop through imagedata
      for (let i=0; i < uint8array.length; i+=4) {
        // Find matching palette color
        for (let c=0; c < palette.colors.length; c++) {
          let col = palette.colors[c]
          if (
            col.r === uint8array[i] &&
            col.g === uint8array[i+1] &&
            col.b === uint8array[i+2]
          ) {
            pixels[pixelIndex++] = c
            break
          }
        }

      }


      // generate imageData
      let imageData = new ImageData(256, 256)
      // From original...
        for (let i = 0; i < uint8array.length; i++) {
          imageData.data[i] = uint8array[i]
        }
      // From pixels & palette...
      let data = imageData.data
      let index = 0
      for (let i = 0; i < 65535; i++) {
        let theColor = palette.colors[pixels[i]]
        data[index++] = theColor.r
        data[index++] = theColor.g
        data[index++] = theColor.b
        data[index++] = 255
      }

      // Return a bitmap
      let ppid = {
        pixels,
        palette,
        imageData
      }
      return ppid
    },

    imageDataFromPixelsAndPalette() {

      return imageData
    },
    imageDataFromColors(colors) {
      // Assumes 256 colors!
      let imageData = new ImageData(256, 256)

      if (!colors.length) return imageData
      let offset = 0
      let colorIndex = 0
      for (let y = 0; y < 16; y++) {
        for (let x = 0; x < 16; x++) {
          for (let yy = 0; yy < 16; yy++) {
            for (let xx = 0; xx < 16; xx++) {
              offset = (((x * 16) + xx) * 4) +  (((y * 16) + yy) * 256 * 4)
              imageData.data[offset++] = colors[colorIndex].r
              imageData.data[offset++] = colors[colorIndex].g //colors[i].g
              imageData.data[offset++] = colors[colorIndex].b //colors[i].b
              imageData.data[offset++] = colors[colorIndex].a
            }
          }
          colorIndex++
        }
      }


      return imageData

    }
  }
}
</script>

<style lang="stylus">
  // "variables" is a Webpack alias (defined in /config/index.js)
  // which points to /src/themes/quasar.variables.styl
  // in your starter kit
  @import '~variables'
  $primary = white
</style>

