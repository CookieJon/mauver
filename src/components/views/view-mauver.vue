<template lang="pug">
<!-- root node required -->
div

  // COLLECTION
  j-panel(icon='business', title='Sample', :width='370', :height='200', :x='10', :y='10')
    div.j-panel-toolbar.text-black(slot='toolbar', style='padding:4px;')
      q-btn(round,primary,small,icon='business', @click='addPalette')
      //$refs.zone.openFileInput()
    div.j-tray.area.panel-item-grow(slot='content')
      j-upload-zone(ref='zone')
        j-collection.frame-type-grid(v-model='palettes', @select='selectPalette')

</template>

<script>
/* eslint-disable */
import {
  dom,  event,  openURL,  QLayout,  QToolbar,  QToolbarTitle,  QBtn,  QIcon,  QList,  QListHeader,  QItem,  QItemSide,  QItemMain,  QSlider
} from 'quasar'

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
      uid: 0
    }
  },
  computed: {
    palettes () {
      // return this.$store.getters['entities/palettes/query']().orderBy('id', 'desc').get()
      return this.$store.getters['entities/palettes/query']().get()
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
    addPalette () {
      let pal = {
        id: this.uid++,
        colors: [{id:'red'}, {id:'green'}, {id:'blue'}]
      }

      this.$store.dispatch('entities/palettes/insert', {data: pal})
      //let pal = this.$store.getters['entities/palettes/find'](this.uid-1)
      pal.init()
    },
    selectPalette (e) {
      this.selectedPalette = e.item.id
    },

    toggle (todo) {
      this.$store.dispatch('entities/todos/update', { id: todo.id, done: !todo.done })
    },

    update (id, title) {
      this.$store.dispatch('entities/todos/update', { id, title })
    },

    destroy (id) {
      this.$store.dispatch('entities/todos/delete', id)
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

