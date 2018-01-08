
/* !moe.store.js v0.1.1 No vuex!
 * (c) 2016 CookieJon
 * Released under the MIT License.
 * https://github.com/Alex-fun/vue-drag-and-drop-list#readme
 */

/* eslint-disable */

import MoeObjects from '../moe/objects'
import Vue from 'vue'
// Global mixing components
/**/
var jArtwork = require('components/custom/j-artwork')
var jComponent = require('components/custom/j-component')
var jPanel = require('components/custom/j-panel')
var jItem = require('components/custom/j-item')
var jCanvas = require('components/custom/j-canvas')
var jCollection = require('components/custom/j-collection')
// var jCollection = require('components/custom/j-collection')
var jUploadZone = require('components/custom/j-upload-zone')
var jDebug = require('components/custom/j-debug')
var DragEffects = require('components/custom/DragEffects')

function testObj() {
  this.testA = 'My Test'
  this.testFunction = function () {
    alert("Blah")
  }
}
testObj.prototype.testFunction = function () {
  alert(this.testA + 'works!')
}

//  --- state
//
let state = {
  repo: {
    bitmaps: {}
  },
  workbench: {
    editors: []
  },
  leverPercent: 50,
  leverValue: 50,
  sliderValue: 0,
  test: 'Hi Jon',
  bitmaps: [],
  artworks: [],
  palettes: [],
  filters: [],
  activeBitmap: {},
  activeArtwork: {},
  notes: [],
  imgUrls: [
    '/statics/img/resource/bg/more1.png',
    '/statics/img/resource/bg/more2.png',
    '/statics/img/resource/bg/bg2.png',
    '/statics/img/resource/bg/bg10.png',
    '/statics/img/resource/bg/bitmap1.bmp',
    '/statics/img/resource/bg/bitmap2.bmp',
    '/statics/img/resource/bg/bitmap3.bmp',
    '/statics/img/resource/bg/bitmap4.bmp'
  ]
}

// -- ui
//
let ui = {

}

//  --- actions
//
let uid = 0
const actions = {

  getRef (ref, field) {
    let obj = state.repos[ref.repo][ref.key]
    if (!obj) return null
    if (field) return obj[field]
    return obj
  },

  artwork_AddFilter (oArtwork, oFilter) {
    oArtwork.bitmap = oFilter
    console.log('artwork_AddFilter')
  },

  addBitmap (payload) {
    // @payload: {
    //   bitmap:     // <- create from template bitmap
    //   imageData:  // <- create from imgData
    //   file:       // <- load & create from file object
    //   src:        // <- load & create from file name
    //   url:        // <- load & create from url
    // }
    var bitmap = new MoeObjects.Bitmap()
    var src = state.imgUrls[Math.floor(Math.random() * state.imgUrls.length)]
    var id = 'bit_000' + uid++
    var testobj = { test: 'pass' }
   //  state.repo.bitmaps[id] = bitmap
   // state.repo.bitmaps[id] = bitmap
    bitmap.init({src, id})
    Vue.set(state.repo.bitmaps, id, bitmap)
    // 
    let ref = new Ref()
    // state.bitmaps.push(ref)
    state.bitmaps.push(bitmap)
    ref.init({repo: 'bitmaps', key: id})
  },

  setActiveBitmap (bitmap) {
    console.log(':-)')
    state.activeBitmap = bitmap
  },

  addArtwork (payload) {
    var artwork = new MoeObjects.Artwork()
    var id = 'art_000' + uid++
    artwork.init({id})
   /// Vue.set(state.repo.artworks, id, artwork)
    state.artworks.push(artwork)
   // state.artworks.push(new Ref())
  },

  setActiveArtwork (artwork) {
    state.activeArtwork = artwork
    console.log('Active artwork', artwork)
  },

  addFilter (payload) {
    var filter = new MoeObjects.Filter()
    filter.init({})
    state.filters.push(filter)
  },

  setActiveFilter (bitmap) {
    state.activeFilter = bitmap
  }
}

//  --- Define Store mixin
//
const Mixin = {
  // data () {
  //   return {
  //     $state: state
  //   }
  // },
  methods: {
    ...actions
  },
  beforeCreate () {
    this.$state = state
  }
}

// var Vue // bind on install
function Ref () {
  this._type = 'Ref'
  this.repo = null
  this.key = null
}
Ref.prototype = {
  constructor: Ref,
  init: function (options) {
    this.repo = options.repo
    this.key = options.key
  },
  getRef () {
    return state.repos[this.repo]
  }

}

function install (Vue, options) {
  // if (install.installed) { return }
  // install.installed = true

  // Prepare the store
  //

  let moe = {
    vm: new Vue({
      data: state, // <- Giving state to vm makes it reactive!
    }),
    actions: actions,
    state: state
  }

  Object.defineProperty(Vue.prototype, '$moe', {
    get: function get () { return moe }
  })
  Object.defineProperty(Vue.prototype, '$state', {
    get: function get () { return moe.state }
  })
  Object.defineProperty(Vue.prototype, '$actions', {
    get: function get () { return moe.actions }
  })

  Vue.mixin({
    components: {
      jPanel, jItem, jCanvas, jUploadZone, jCollection, jComponent, jDebug, jArtwork
    }
    // methods: {
    //   $
    // }
    // beforeCreate () {
    //   this.$moe = moe
    // }
    // beforeCreate: function beforeCreate () {
    //   if (this.$options.router) {
    //     this._router = this.$options.router
    //     this._router.init(this)
    //     Vue.util.defineReactive(this, '_route', this._router.history.current)
    //   }
    // }
  })

}
function mapState (states) {
  var res = {}
  normalizeMap(states).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedState () {
      return typeof val === 'function'
        ? val.call(this, this.$store.state, this.$store.getters)
        : this.$store.state[val]
    }
  })
  return res
}

//  --- Export as Vue plugin
//
var index = {
  // Store: Store,
  install: install,
  // mapState: mapState,
  // mapMutations: mapMutations,
  // mapGetters: mapGetters,
  // mapActions: mapActions
}

export default index

// // define the possible mutations that can be applied to our state
// const mutations = {
//   UPDATE (state, {key, val}) {
//     console.log('yeah')
//     // 'a.b.etc'.split('.').reduce((o,i)=>o[i], obj)
//   },

//   UPDATE_BITMAP (state, payload) {
//     console.log('UPDATE_BITMAP', payload)
//     // state.bitmaps.find(obj => obj.id === payload.obj.id)[payload.key] = payload.val
//     // 'a.b.etc'.split('.').reduce((o,i)=>o[i], obj)
//   },

//   ARRANGE_BITMAP (state, payload) {
//     // @payload: {
//     //   obj:
//     //   fromIndex:
//     //   toIndex:
//     // }
//     var from = payload.fromIndex
//     var to = payload.toIndex
//     state.bitmaps.splice(to, 0, state.bitmaps.splice(from, 1)[0])
//     state.activeBitmap = state.bitmaps[to]
//   },

//   ADD_BITMAP (state, payload) {
//     // @payload: {
//     //   bitmap: Bitmap
//     // }
//     // var bitmap = {
//     //   id: 'bitmap-' + state.bitmaps.length,
//     //   src: payload.src,
//     //   name: 'Untitled ' + state.bitmaps.length
//     // }
//     // console.log(state, bitmap)
//     payload.bitmap.init().then(
//       state.bitmaps.push(payload.bitmap))
//   },

//   DELETE_BITMAP (state) {

//   },

//   SET_ACTIVE_BITMAP (state, payload) {
//     console.log('SET_ACTIVE_BITMAP', payload)
//     state.activeBitmap = payload.obj
//   }
// }

// const getters = {
//   all: state => state,
//   bitmaps: state => state.bitmaps,
//   activeBitmap: state => state.activeBitmap
// }



  // 'use strict'

  // var MoeStore = {
  //   // UI schema
  //   ui: {
  //     PanelCollection: {
  //       model: null,
  //       component: 'j-panel',
  //       options: {
  //         toolbar: {

  //         }
  //       }

  //     },
  //     jPanel: {
  //       model: null,
  //       type: 'j-panel',
  //       variation: null
  //     }
  //   },

  //   // UI state
  //   workbench: {

  //   },
  //   // Object schema
  //   templates: {
  //     Bitmap: {
  //       id: 'String',
  //       title: 'String',
  //       src: 'Array',
  //       imageData: 'UInt256Array'
  //     }
  //   },
  //   // Object state
  //   resources: {
  //     bitmaps: {
  //       _meta: {

  //       },
  //       bitmap1: {
  //         _template: 'Bitmap',
  //         id: 'bitmap1',
  //         title: 'zxc',
  //         src: '/statics/img/resource/bg/more1.png',
  //         imageData: null
  //       },
  //       bitmap2: {
  //         id: 'bitmap2',
  //         title: 'asd',
  //         src: '/statics/img/resource/bg/more2.png',
  //         imageData: null
  //       },
  //       bitmap3: {
  //         id: 'bitmap3',
  //         title: 'qwe',
  //         src: '/statics/img/resource/bg/bg2.png',
  //         imageData: null
  //       },
  //       bitmap4: {
  //         id: 'bitmap4',
  //         title: 'sdf',
  //         src: '/statics/img/resource/bg/bg10.png',
  //         imageData: null
  //       },
  //       bitmap5: {
  //         id: 'bitmap5',
  //         title: 'xcv',
  //         src: '/statics/img/resource/bg/bitmap1.bmp',
  //         imageData: null
  //       }
  //     }
  //   },
  //   editor: {
  //     bitmaps: [],
  //     activeBitmap: []
  //   },
  //   activeBitmap: {},
  //   notes: [],
  //   currentLevel: 70,
  //   imgUrls: [
  //     '/statics/img/resource/bg/more1.png',
  //     '/statics/img/resource/bg/more2.png',
  //     '/statics/img/resource/bg/bg2.png',
  //     '/statics/img/resource/bg/bg10.png',
  //     '/statics/img/resource/bg/bitmap1.bmp'
  //   ],
  //   'building': {
  //     'levels': {
  //       'id': {
  //         'id': null,
  //         'spaces': {
  //           'artwork': null,
  //           'other': {
  //             key: null,
  //             exits: null
  //           }
  //         }
  //       }
  //     },
  //     'artworks': {
  //       'id': {
  //         id: null,
  //         filters: []
  //       }
  //     },
  //     'palettes': {
  //     }

  //   },
  //   actions: {

  //   }
  // }

  //

