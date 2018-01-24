/* eslint-disable */

import Vue from 'vue'
import Vuex from 'vuex'

import { extend } from 'quasar'

// import * as actions from './actions'
// import cart from './modules/cart'
// import products from './modules/products'

import { normalize, denormalize, schema } from 'normalizr'

const Color = new schema.Entity('colors', {
  // id: null,
  // name: null,
  // r: null,
  // g: null,
  // b: null,
  // a: null,
  // h: null,
  // v: null,
  // chroma: null,
  // luma: null
})

const Palette = new schema.Entity('palettes', {
  // id: null,
  // name: null,
  // imageData: null,
  colors: [ Color ]
})

const Bitmap = new schema.Entity('bitmaps', {
  // id: null,
  // name: null,
  // imageData: null,
  // pixels: null,
  palette: Palette
})

const Artwork = new schema.Entity('artworks', {
  // id: null,
  // name: null,
  // imageData: null,
  // filters: [ ],
  bitmap: Bitmap
})

// MASTER SCHEMA
const Museum = {
  colors: [ Color ],
  artworks: [ Artwork ],
  palettes: [ Palette ]
}



console.log('................')



Vue.use(Vuex)

const store = new Vuex.Store({
  // modules: {
  //   cart,
  //   products
  // },
  state: {
    entities: {
      colors: {},
      palettes: {},
      bitmaps: {},
      artworks: {},
    },
    result: {
      location: 'Guggenheim'
    }
  },
  actions: {
    // addBitmap ({commit, state}, bitmap) {
    //   nBitmap = normalize(Bitmap, bitmap)
    //   commit('ADD_BITMAP', nBitmap)
    // },
    addColors ({commit, state}, payload) {
      // @payload - Object|Array of Colors
      let colors = Array.isArray(payload.data) ? payload.data  : [payload.data]
      let n = normalize({colors: colors}, Museum )
      commit('ADD_COLORS', n.entities)
    },
    addPalette ({commit, state}, payload) {
      console.log('Action add Palette', payload)
      let palette = Array.isArray(payload.data) ? payload.data  : [payload.data]
      let n = normalize({palettes: palette}, Museum )
      commit('ADD_ENTITIES', n.entities)
    }
  },
  mutations: {
    ADD_ENTITIES: function(state, payload) {
      // payload = entities: {...}
      // Merge entities with state.entities
      console.log("OLD", state.entities)
      console.log("NEW", payload)
      //extend({}, state.entities, payload)
      let result = extend(true, {}, state.entities, payload)
      console.log("RESULT", result)
      Vue.set(state, 'entities', result)
    },

    ADD_COLORS: function(state, payload) {
      // payload = entities: {...}
      // Merge entities with state.entities
      console.log('ADD_COLORS................')
      extend(state.entities, payload)
    }
  },
  getters: {
    // https://github.com/vuejs/vuex/issues/598 - Getters return functions
    getColorById: (state, getters) => (id) => {
      return getters.colors.find(x=> x.id === id)
    },
    getColor: (state, getters) => ({ name, color }) => {
      return getters.find( x=> x.fullName === name && x.color === color )
    },

    colors: (state) => {
      let ids = Object.keys(state.entities.colors)
      let dn = denormalize({ colors: ids }, Museum, state.entities)
      return dn.colors
    },
    palettes: (state) => {
      let ids = Object.keys(state.entities.palettes)
      let dn = denormalize({ palettes: ids }, Museum, state.entities)
      return dn.palettes
    },
    // GENERIC!
    entities: (state) => (type) => {
      let ids = Object.keys(state.entities[type])
      let dn = denormalize({ [type]: ids }, Museum, state.entities)
      return dn[type]
    },    

  }
})

export default store
