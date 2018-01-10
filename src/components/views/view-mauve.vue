<template lang="pug">
<!-- root node required -->
div
  //- pre {{$state}}
  //- // test
  //- div.workbench.fullscreen
  //-   j-object(v-model='$state')
  //-   j-object(v-model='$state.imgUrls')

      
  // BITMAPS
  j-panel(icon='business', title='bmp', :width='370', :height='200', :x='10', :y='10')
    div.j-panel-toolbar.text-black(slot='toolbar', style='padding:4px;')
      q-btn(round,primary,small,icon='business', @click='$refs.zone.openFileInput()')
    div.j-tray.area.panel-item-grow(slot='content')
      j-upload-zone(ref='zone')
        j-collection.frame-type-grid(v-model='$state.bitmaps', @clickItem='b => {$actions.setActiveBitmap(b)}')
  
  // ARTWORKS
  j-panel(icon='business', title='Artworks', :width='370', :height='200', :x='10', :y='210')
    div.j-panel-toolbar.text-black(slot='toolbar', style='padding:4px;')
      q-btn(round,primary,small,icon='business', @click='$actions.addArtwork()')
    div.j-tray.area.panel-item-grow(slot='content')
      j-collection.frame-type-grid(v-model='$state.artworks', @clickItem='b => {$actions.setActiveArtwork(b)}')

  // ACTIVE ARTWORK
  j-panel(icon='business', :title='$state.activeArtwork ? $state.activeArtwork.id : "none"', :width='600', :height='680', :x='10', :y='430')
    div.j-tray.area.panel-item-grow(slot='content')
      j-artwork(v-model='$state.activeArtwork')

  //- j-panel(:key='item.id', v-for='item in $state.workbench.editors', title='EDIT:', :width='420', :height='420', :x='640', :y='10')
  //-   div.j-panel-toolbar.text-black(slot='toolbar', style='padding:4px;')
  //-     q-btn(round,primary,small,icon='add',@click='$actions.addArtwork()')
  //-   div.j-tray.area.panel-item-grow(slot='content')
  //-     j-collection.frame-type-grid(v-model='$state.bitmaps', @clickItem='b => {$actions.setActiveBitmap(b)}')

  //- // ART DETAILS
  //- j-panel(icon='business', title='ART', :width='520', :height='520', :x='640', :y='10')
  //-   div.j-tray.area.panel-item-grow(slot='content')
  //-     j-canvas.frame-type-grid(:image-data=' this.$state.activeBitmap ? this.$state.activeBitmap.imageData : null')

  // BITMAP PREVIEW
  j-panel(icon='business', :title='$state.activeBitmap ? $state.activeBitmap.id : "none"', :width='370', :height='370', :x='600', :y='400')
    div.j-tray.area.panel-item-grow(slot='content')
      | ss {{ $state.activeBitmap ? $state.activeBitmap.id : 'none'}}
      j-canvas.frame-type-grid(:image-data=' this.$state.activeBitmap ? this.$state.activeBitmap.imageData : null')
      | dd
</template>


  <!--
   JS Path: Node + Express or possibly Adonisjs, Koa (have to google what it even is sigh), don't fiddle around with API or form schemas just yet, say hello briefly to Mongo, and dive into postgresql (fallingback to old faithful mySQL if it's all too hard)
   Axios / GraphQL
   orm, oauth, perhaps websockets
   graphql
   -->


</template>

<script>
/* eslint-disable */
import {
  dom,
  event,
  openURL,
  QLayout,
  QToolbar,
  QToolbarTitle,
  QBtn,
  QIcon,
  QList,
  QListHeader,
  QItem,
  QItemSide,
  QItemMain,
  QSlider
} from 'quasar'

const
  { viewport } = dom,
  { position } = event,
  moveForce = 30,
  rotateForce = 40,
  RAD_TO_DEG = 180 / Math.PI

var jComponent = require('components/custom/j-component')
// var jPanel = require('components/custom/j-panel')
import jPanel from 'components/custom/j-panel'
var jItem = require('components/custom/j-item')
var jCanvas = require('components/custom/j-canvas')
var jCollection = require('components/custom/j-collection')
// var jCollection = require('components/custom/j-collection')
var jUploadZone = require('components/custom/j-upload-zone')
var jDebug = require('components/custom/j-debug')
var jObject = require('components/custom/j-object')
var DragEffects = require('components/custom/DragEffects')
var jSlider = require('components/custom/j-slider')

//import {JSONEditor} from 'json-editor'
function testObj() {
  this.test1 = 'test 1'
  this.testFn = function () {
    alert('testing ' + this.test1)
  }
}

export default {
  name: 'view-mauve',
  data () {
    return {
      test1: [
        ['One','Two','Three','Four'],
        ['Un','Deux','Trois','Quatre'],
        ['Uno','Dos','Tres','Cuatro']
      ],
      testvalue: 3,
      test: new testObj()
      // searchText: 'this is a test',
      // test: this.$moe.state.test
    }
  },
  computed: {
    previewImageData () {
      console.log('computed previewImageData ' + this.$state.activeBitmap.id)
      return this.$state.activeBitmap ? this.$state.activeBitmap.imageData : null  
    }
  },
  components: {
     QSlider, QIcon, jPanel, QBtn, jItem, jCanvas, jUploadZone, jCollection, DragEffects, jComponent, jDebug, jObject, jSlider
  },
  mounted () {
  },
  methods: {
    doMethod (e) {
      this[e]()
    },
    test1 () {
      alert('test1')
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

  