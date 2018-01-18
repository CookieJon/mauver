<template lang="pug">
<!-- root node required -->
div

  // COLLECTION
  j-panel(icon='business', title='Sample', :width='300', :height='400', :x='10', :y='10')
    div.j-panel-toolbar.text-black(slot='toolbar', style='padding:4px;')
      q-btn(round,primary,small,icon='business', @click='addPalette')
      q-btn(round,primary,small,icon='business', @click='openFileInput')
    div.j-tray.area.panel-item-grow(slot='content')
      j-upload-zone(ref='zone',@select='loadImagesFromFile')
        j-collection.frame-type-grid(v-model='palettes', @select='selectPalette')
    div.j-tray.area.panel-item-grow(slot='content')
      j-collection.frame-type-grid(v-model='bitmaps', @select='selectBitmap')

  // SELECTED 
  j-panel(v-if='selectedBitmap != null', icon='business', title='Selected', :width='200', :height='300', :x='110', :y='400')
    div.j-tray.area.panel-item-grow(slot='content')
      j-canvas.frame-type-grid(:image-data='selectedBitmapImageData')
  
  // SELECTED 
  j-panel(v-if='selectedPalette != null', icon='business', title='Selected', :width='200', :height='300', :x='10', :y='400')
    div.j-tray.area.panel-item-grow(slot='content')
      j-canvas.frame-type-grid(:image-data='selectedPaletteImageData')
</template>

<script>
/* eslint-disable */
import { dom, event, openURL, QLayout, QToolbar, QToolbarTitle, QBtn, QIcon, QList, QListHeader, QItem, QItemSide, QItemMain, QSlider} from 'quasar'
import MoeObjects from '../../moe/objects'
import colors from '../../data'

// CREATE INITIAL DATA
// import colorUtils from 'moe/utils/moe.utils.color.js'
// let pal = colorUtils.getMaterialColors(0,256)
// let palObj = {}
// pal.forEach(v => palObj[v.id] = v)
// console.log('PALETTE', JSON.stringify(pal))

export default {
  name: 'view-mauver',
  components: { QBtn},
  data () {
    return {
      selectedPalette: null,
      selectedBitmap: null,
      uid: 0
    }
  },
  computed: {
    selectedPaletteImageData () {
      let selectedPalette = this.$store.getters['entities/palettes/find'](this.selectedPalette)
      return selectedPalette != null ? selectedPalette.imageData : null
    },
    selectedBitmapImageData () {
      let selectedBitmap = this.$store.getters['entities/bitmaps/find'](this.selectedBitmap)
      return selectedBitmap ? selectedBitmap.imageData : null
    },
    palettes: {
      get () {
        // return this.$store.getters['entities/palettes/query']().orderBy('id', 'desc').get()
        return this.$store.getters['entities/palettes/query']().get()
      },
      set() {
        // alert('sorted')
      }
    },
    bitmaps: {
      get () {
        // return this.$store.getters['entities/palettes/query']().orderBy('id', 'desc').get()
        return this.$store.getters['entities/bitmaps/query']().get()
      },
      set() {
        // alert('sorted')
      }
    }    
  },
  created () {
    // Here we are stubbing the initial data. In the real world, this
    // should be the response from the API Backend.
    const initialData = colors
    console.log('data', colors)
    this.$store.dispatch('entities/colors/create', { data: initialData })
  },
  methods: {

    loadImagesFromFile(files) {
      // Invoked from uploadZone@select
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

    loadImageFromFile(file) {
      // One file at a time, please!
      console.log('loadImageFromFile:', file)
      return new Promise((resolve, reject) => {

        let bmp = {
          id: this.uid++
        }

        // A. Custom jBMP
        //
        if (file.size === 66614 && file.name.match(/.bmp/) ) {
          var reader = new FileReader()
          reader.onload = () => {
            let arrayBuffer = reader.result
            let pixPalImagedata = this.fromArrayBuffer(arrayBuffer)
            let bmp = {
              id: this.uid++, 
              ...pixPalImagedata
            }
            resolve(bmp)
          }
          reader.readAsArrayBuffer(file) // for BMP8 raw file
        }
        // B. Any other image
        //
        else if (file.type.match(/image.*/)) {
          var reader = new FileReader()
          reader.onload = () => {
            bmp.dataURL = reader.result
            resolve(bmp)
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
      this.$store.dispatch('entities/bitmaps/insert', {data: bmp})
    },
    addPalette () {
      console.clear()
      console.log('|---addPalette()---------------------------------------> ')
      // INITIALISE PALETTE!
      let colors = this.$store.getters['entities/colors/all']()

      // DEBUG COLOR LIST
      // let out = '', styles=[];for (let i=0; i < colors.length; i++) {out += '%c'+i,styles.push('color:'+colors[i].hex+';')};console.log("COLORS:");console.log(out, ...styles)

      let imageData = new ImageData(256, 256)
      
      // Draw palette image data
      let offset = 0
      let colorIndex = 0    
      for (let y = 0; y < 16; y++) {
        for (let x = 0; x < 16; x++) {
          for (let yy = 0; yy < 16; yy++) {
            for (let xx = 0; xx < 16; xx++) {
              offset = (((x * 16) + xx) * 4) +  (((y * 16) + yy) * 256 * 4)
              // console.log(offset, colors[colorIndex])
              imageData.data[offset++] = colors[colorIndex].r
              imageData.data[offset++] = colors[colorIndex].g //colors[i].g
              imageData.data[offset++] = colors[colorIndex].b //colors[i].b
              imageData.data[offset++] = colors[colorIndex].a  
            }
          }
          colorIndex++
        }
      }
      let pal = {
        id: this.uid++,
        colors,
        imageData 
      }
      
      this.$store.dispatch('entities/palettes/insert', {data: pal})
      console.log('<---addPalette()---------------------------------------|')
      //let pal = this.$store.getters['entities/palettes/find'](this.uid-1)
      //pal.init()
    },
    selectPalette (e) {
      this.selectedPalette = e.item.id
    },
    selectBitmap(e) {
      this.selectedBitmap = e.item.id
    },

    toggle (todo) {
      this.$store.dispatch('entities/todos/update', { id: todo.id, done: !todo.done })
    },

    update (id, title) {
      this.$store.dispatch('entities/todos/update', { id, title })
    },

    destroy (id) {
      this.$store.dispatch('entities/todos/delete', id)
    },

    fromArrayBuffer (srcArrayBuffer) {
      // bitmap stream
      let dataview = new DataView(srcArrayBuffer)
      let offBits = dataview.getUint16(10, true)
      let width = dataview.getUint32(18, true)
      let height = dataview.getUint32(22, true)
      let bitCount = dataview.getUint16(28, true)
      // var totalColors = dataview.getUint16(46, true)
      let usedColors = dataview.getUint16(50, true)

      // pixels
      let length = width * height
      let pixels_key = new Uint8Array(length)
      for (var y = 0; y < 256; y++) {
        for (var x = 0; x < 256; x++) {
          pixels_key[x + y * 256] = dataview.getUint8(offBits + x + (255 - y) * 256) // Invert Y axis (BMP8 data goes from bottom->top)
        }
      }
      let pixels = Uint8Array.from(pixels_key)

      // palette
      let paletteLength = bitCount === 0 ? 1 << bitCount : usedColors
      let index = 54
      let tmpPalette = []
      for (let i = 0; i < paletteLength; i++) {
        var b = dataview.getUint8(index++)
        var g = dataview.getUint8(index++)
        var r = dataview.getUint8(index++)
        var a = dataview.getUint8(index++)
        tmpPalette.push({r, g, b, a}) // TODO: Make real colors!
      }
      let palette_key = tmpPalette
      let palette = Array.from(tmpPalette)


      let imageData = new ImageData(width, height)
      let data = imageData.data
      let mapToIndex = 0
      for (var i = 0; i < 65535; i++) {
        let theColor = palette_key[pixels[i]]
        data[mapToIndex++] = theColor.r
        data[mapToIndex++] = theColor.g
        data[mapToIndex++] = theColor.b
        data[mapToIndex++] = 255
      }

      console.log("ASDASDASD", imageData)

      let ppid =  {
        pixels,
        palette,
        imageData
      }
      return ppid
    },
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

