<template lang="pug">
<!-- root node required -->
div
  // pre {{$state}}
  // test
  // div.workbench.fullscreen
  //   j-object(v-model='$state')
  //  j-object(v-model='$state.imgUrls')

  // DEBUG
  j-panel(icon='business', title='Debug', :width='220', :height='720', :x='10', :y='10')
    div.j-tray.area.panel-item-grow(slot='content')
      j-object(v-model='$state')

  // SLIDER
  j-panel(icon='business', title='Slider', :width='600', :height='420', :x='235', :y='10')
    div.j-tray.area.panel-item-grow(slot='content')
      br 
      br
      j-slider


  // BITMAPS
  j-panel(icon='business', title='Bitmaps', :width='320', :height='420', :x='340', :y='10')
    div.j-panel-toolbar.text-black(slot='toolbar', style='padding:4px;')
      button.circular.primary.small(@click='$actions.addBitmap()')
        i add
    div.j-tray.area.panel-item-grow(slot='content')
      j-collection.frame-type-grid(v-model='$state.bitmaps', @clickItem='b => {$actions.setActiveBitmap(b)}')

  // ART
  j-panel(icon='business', title='ART', :width='420', :height='420', :x='640', :y='10')
    div.j-panel-toolbar.text-black(slot='toolbar', style='padding:4px;')
      button.circular.primary.small(@click='$actions.addArtwork()')
        i add
    div.j-tray.area.panel-item-grow(slot='content')
      j-collection.frame-type-grid(v-model='$state.bitmaps', @clickItem='b => {$actions.setActiveBitmap(b)}')


  j-panel(v-for='item in $state.workbench.editors', title='EDIT:', :width='420', :height='420', :x='640', :y='10')
    div.j-panel-toolbar.text-black(slot='toolbar', style='padding:4px;')
      button.circular.primary.small(@click='$actions.addArtwork()')
        i add
    div.j-tray.area.panel-item-grow(slot='content')
      j-collection.frame-type-grid(v-model='$state.bitmaps', @clickItem='b => {$actions.setActiveBitmap(b)}')

  // ART DETAILS
  j-panel(icon='business', title='ART', :width='520', :height='520', :x='640', :y='10')
    div.j-tray.area.panel-item-grow(slot='content')
      j-canvas.frame-type-grid(:image-data=' this.$state.activeBitmap ? this.$state.activeBitmap.imageData : null')

  // PREVIEW
  j-panel(icon='business', title='Preview', :width='320', :height='420', :x='340', :y='550')
    div.j-tray.area.panel-item-grow(slot='content')
      | ss {{ $state.activeBitmap ? $state.activeBitmap.id : 'none'}}
      j-canvas.frame-type-grid(:image-data=' this.$state.activeBitmap ? this.$state.activeBitmap.imageData : null')
      | dd
</template>

<div>

  <!--
   JS Path: Node + Express or possibly Adonisjs, Koa (have to google what it even is sigh), don't fiddle around with API or form schemas just yet, say hello briefly to Mongo, and dive into postgresql (fallingback to old faithful mySQL if it's all too hard)
   Axios / GraphQL
   orm, oauth, perhaps websockets
   graphql
   -->

  <div style="border:1px solid blue;position:relative">
    <j-object v-model="$state"></j-object>
  </div>

  </div><!-- root node required -->

</template>

<script>
/* eslint-disable */

var jComponent = require('components/custom/j-component')
var jPanel = require('components/custom/j-panel')
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
    jPanel, jItem, jCanvas, jUploadZone, jCollection, DragEffects, jComponent, jDebug, jObject, jSlider
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
<style>

/* Functional styling;
 * These styles are required for noUiSlider to function.
 * You don't need to change these rules to apply your design.
 */
.noUi-target,
.noUi-target * {
-webkit-touch-callout: none;
-webkit-user-select: none;
-ms-touch-action: none;
	touch-action: none;	
-ms-user-select: none;
-moz-user-select: none;
-moz-box-sizing: border-box;
	box-sizing: border-box;
}
.noUi-target {
	position: relative;
	direction: ltr;
}
.noUi-base {
	width: 100%;
	height: 100%;
	position: relative;
	z-index: 1; /* Fix 401 */
}
.noUi-origin {
	position: absolute;
	right: 0;
	top: 0;
	left: 0;
	bottom: 0;
}
.noUi-handle {
	position: relative;
	z-index: 1;
}
.noUi-stacking .noUi-handle {
/* This class is applied to the lower origin when
   its values is > 50%. */
	z-index: 10;
}
.noUi-state-tap .noUi-origin {
-webkit-transition: left 0.3s, top 0.3s;
	transition: left 0.3s, top 0.3s;
}
.noUi-state-drag * {
	cursor: inherit !important;
}

/* Painting and performance;
 * Browsers can paint handles in their own layer.
 */
.noUi-base {
	-webkit-transform: translate3d(0,0,0);
	transform: translate3d(0,0,0);
}

/* Slider size and handle placement;
 */
.noUi-horizontal {
	height: 18px;
}
.noUi-horizontal .noUi-handle {
	width: 34px;
	height: 28px;
	left: -17px;
	top: -6px;
}
.noUi-vertical {
	width: 18px;
}
.noUi-vertical .noUi-handle {
	width: 28px;
	height: 34px;
	left: -6px;
	top: -17px;
}

/* Styling;
 */
.noUi-background {
	background: #FAFAFA;
	box-shadow: inset 0 1px 1px #f0f0f0;
}
.noUi-connect {
	background: #3FB8AF;
	box-shadow: inset 0 0 3px rgba(51,51,51,0.45);
-webkit-transition: background 450ms;
	transition: background 450ms;
}
.noUi-origin {
	border-radius: 2px;
}
.noUi-target {
	border-radius: 4px;
	border: 1px solid #D3D3D3;
	box-shadow: inset 0 1px 1px #F0F0F0, 0 3px 6px -5px #BBB;
}
.noUi-target.noUi-connect {
	box-shadow: inset 0 0 3px rgba(51,51,51,0.45), 0 3px 6px -5px #BBB;
}

/* Handles and cursors;
 */
.noUi-draggable {
	cursor: w-resize;
}
.noUi-vertical .noUi-draggable {
	cursor: n-resize;
}
.noUi-handle {
	border: 1px solid #D9D9D9;
	border-radius: 3px;
	background: #FFF;
	cursor: default;
	box-shadow: inset 0 0 1px #FFF,
				inset 0 1px 7px #EBEBEB,
				0 3px 6px -3px #BBB;
}
.noUi-active {
	box-shadow: inset 0 0 1px #FFF,
				inset 0 1px 7px #DDD,
				0 3px 6px -3px #BBB;
}

/* Handle stripes;
 */
.noUi-handle:before,
.noUi-handle:after {
	content: "";
	display: block;
	position: absolute;
	height: 14px;
	width: 1px;
	background: #E8E7E6;
	left: 14px;
	top: 6px;
}
.noUi-handle:after {
	left: 17px;
}
.noUi-vertical .noUi-handle:before,
.noUi-vertical .noUi-handle:after {
	width: 14px;
	height: 1px;
	left: 6px;
	top: 14px;
}
.noUi-vertical .noUi-handle:after {
	top: 17px;
}

/* Disabled state;
 */
[disabled].noUi-connect,
[disabled] .noUi-connect {
	background: #B8B8B8;
}
[disabled].noUi-origin,
[disabled] .noUi-handle {
	cursor: not-allowed;
}
</style>
<style lang="stylus">
.slider 
  width 20px
  height 400px
  border 2px solid red
.workbench
    position absolute
    top 0
    left 0
    width 100%
    height 100%
    border 1px solid red
    background rgba(255,255,255,0.02)
  .json {
    background rgba(255, 255, 255, 0.08)
    box-shadow 11px 10px 6px -10px rgba(0,0,0,0.75)
    padding 2px
    padding-left 15px
    margin 4px 0
    // margin -20px 0
    font-size 11px
    width 100%
    transition all .5s
    height auto
  }
  .json > .json {
  }
</style>

  