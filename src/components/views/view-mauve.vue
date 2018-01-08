<template lang="pug">
<!-- root node required -->
div
  //- pre {{$state}}
  //- // test
  //- div.workbench.fullscreen
  //-   j-object(v-model='$state')
  //-   j-object(v-model='$state.imgUrls')

  // ACTIVE ARTWORK SLIDER
  j-panel(icon='business', :title='$state.activeArtwork ? $state.activeArtwork.id : "none"', :width='600', :height='680', :x='20', :y='10')
    div.j-tray.area.panel-item-grow(slot='content')
      j-slider(v-model='$state.activeArtwork')
      
  // BITMAPS
  j-panel(icon='business', title='Bitmaps', :width='370', :height='200', :x='600', :y='10')
    div.j-panel-toolbar.text-black(slot='toolbar', style='padding:4px;')
      q-btn(round,primary,small,icon='business',@click='$actions.addBitmap()')
    div.j-tray.area.panel-item-grow(slot='content')
      j-collection.frame-type-grid(v-model='$state.bitmaps', @clickItem='b => {$actions.setActiveBitmap(b)}')
  
  // ARTWORKS
  j-panel(icon='business', title='Artworks', :width='370', :height='200', :x='600', :y='210')
    div.j-panel-toolbar.text-black(slot='toolbar', style='padding:4px;')
      q-btn(round,primary,small,icon='business',@click='$actions.addArtwork()')
    div.j-tray.area.panel-item-grow(slot='content')
      j-collection.frame-type-grid(v-model='$state.artworks', @clickItem='b => {$actions.setActiveArtwork(b)}')

  //- j-panel(:key='item.id', v-for='item in $state.workbench.editors', title='EDIT:', :width='420', :height='420', :x='640', :y='10')
  //-   div.j-panel-toolbar.text-black(slot='toolbar', style='padding:4px;')
  //-     q-btn(round,primary,small,icon='add',@click='$actions.addArtwork()')
  //-   div.j-tray.area.panel-item-grow(slot='content')
  //-     j-collection.frame-type-grid(v-model='$state.bitmaps', @clickItem='b => {$actions.setActiveBitmap(b)}')

  //- // ART DETAILS
  //- j-panel(icon='business', title='ART', :width='520', :height='520', :x='640', :y='10')
  //-   div.j-tray.area.panel-item-grow(slot='content')
  //-     j-canvas.frame-type-grid(:image-data=' this.$state.activeBitmap ? this.$state.activeBitmap.imageData : null')

  // PREVIEW
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
    // console.log('noui' ,slider === this.$refs.slid, noUiSlider)
    // noUiSlider.create(this.$refs.slider, {
    //   start:0,
    //   orientation: 'vertical',
    //   direction: 'rtl',
    //   behaviour: 'drag',
    //   connect: 'lower',
    //   range: {
    //     'min': [ -10000],
    //     '35%': [ -1200],
    //     '50%': [ 1],
    //     '65%': [ 1200],
    //     'max': [ 10000]		
    //   }
    //   ,pips: {
    //     mode: 'range',
    //     density: 10
    //   }
    // })
    // let oRangeSlider = this.$refs.slider.noUiSlider
    
    // oRangeSlider.on('start', function(e){
    //   console.log("START");
    //   startSliding(theBitmap.pixels);
    // })
    // oRangeSlider.on('end', function(e){
    //   console.log("END");
    //   stopSliding();
      
    // })
    // oRangeSlider.on('slide', function(e){
    //   handle_controlMoved();
    // })	   
    	
    // Populate Array on creation.  
    //	e.g. var myArray = [].repeat(what, howmanyTimes)
    //
    // Array.prototype.repeat= function(what, L){
    //   while(L) this[--L] = what;
    //   return this;
    // }
    // // Populate lower, higher & speeds
    // slidingLower = [].repeat(0, 65536);
    // slidingUpper = [].repeat(255, 65536);
    // slidingSpeeds = [].repeat(0, 65536);    
    // noUiSlider.create(this.$refs.slider, {
    //   start: [20, 80],
    //   connect: true,
    //   range: {
    //     'min': 0,
    //     'max': 100
    //   }
    // });
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

  