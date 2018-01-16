<template lang="pug">
<!-- root node required -->
div

  // COLLECTION
  j-panel(icon='business', title='bmp', :width='370', :height='200', :x='10', :y='10')
    div.j-panel-toolbar.text-black(slot='toolbar', style='padding:4px;')
      q-btn(round,primary,small,icon='business', @click='$refs.zone.openFileInput()')
    div.j-tray.area.panel-item-grow(slot='content')
      j-upload-zone(ref='zone')
        j-collection.frame-type-grid(v-model='palettes', @select='selectPalette')

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

export default {
  name: 'view-mauver',
  components: { QBtn},
  data () {
    return {
    }
  },
  computed: {
    palettes () {

    }
  },
  mounted () {
  },
  methods: {
    selectPalette () {
      alert('hi')
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

  