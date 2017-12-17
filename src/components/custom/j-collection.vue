<template>
  <div>
    <div
      ref="container"
      sortable="options.sortable"
      @sort='onArrange'
      :class="this.class"
      class="frame upload-zone"
    >

    <j-item
      v-for='item, i in value'
      @click='onClickItem(i, $event)'
      :value='value[i]'
      xvalue='$state.repo[item.repo][item.key]||null'>
    </j-item>
    
    </div>
  </div>
</template>
<!--

    <div  v-for='item in value'>
      {{ item.repo + ' ' + item.key }}
    </div>
      @dragenter.stop.prevent="onDragEnter"
      @dragover.stop.prevent="onDragOver"
      @drop.stop.prevent="onDrop"
      -->
<script>
/* eslint-disable */
  // var Bitmap = require('../../moe/moe.bitmap.js')
  var jItem = require('components/custom/j-item')
  var jDebug = require('components/custom/j-debug')
  import { Utils } from 'quasar'
//  import Sortable from 'sortablejs'

  export default {
    name: 'j-collection-rubaxax',
    components: {
      jItem, jDebug
    },
    props: {
      value: {
        type: [Array, Object]
      },
      class: {
        type: String,
        default: 'frame-type-grid'
      }
    },
    data () {
      return {
        test: Utils.extend({}, this.value),
        myValue: this.value,
        options: {
          sortable: {
            animation: 550,
            ghostClass: 'sortable-ghost',  // Class name for the drop placeholder
            chosenClass: 'sortable-chosen',  // Class name for the chosen item
            dragClass: 'sortable-drag'  // Class name for the dragging item
          }
        },
        sortFromIndex: null,
        sortToIndex: null
      }
    },
    computed: {
      //  collection:
    },
    mounted () {
      // var me = this
      Sortable.create(this.$refs.container)
    },
    methods: {
      onArrange (e) {
        let tmp = Utils.extend({}, {val: this.value}).val
        tmp.splice(e.newIndex, 0, tmp.splice(e.oldIndex, 1)[0])
        this.$emit('input', tmp)

        // this.$emit('arrange', {
        //   obj: this.item,
        //   fromIndex: e.oldIndex,
        //   toIndex: e.newIndex
        // })
        // console.log(e)
      },
      onClickItem (index, e) {
        this.$emit("clickItem", this.value[index])
      },
      // onDragEnter (e) {
      //   e.stopPropagation()
      //   e.preventDefault()
      // },
      // onDragOver (e) {
      //   e.stopPropagation()
      //   <e class="preventDefault"></e>
      // },
      // onDrop (e) {
      //   console.log('onDrop:', e, e.dataTransfer.files)
      //   e.preventDefault()
      //   var files = e.dataTransfer.files
      //   for (var i = 0, l = files.length; i < l; i++) {
      //     var file = files[i]
      //     if (!file.type.match(/image.*/)) {
      //       console.log('File ', i, 'not an image. Won\'t create bitmap.')
      //     }
      //     else {
      //       // this.loadImage(file)
      //       console.log('File type = ', file.type)
      //       this.$store.dispatch('addBitmap', {file})
      //     }
      //   }
      //   // $vm.$refs.fileinput.files = files // this code line fires your 'fileCloadImagehanged' function (imageLoader change event)
      // },

    }
  }
</script>

<style lang="stylus">

.ui-resizable
  position absolute

/* frame-type-grid */
.frame.frame-type-grid
  padding 5px
  xbackground-color #f0f0f0

.frame.frame-type-grid > .frame
  width calc(33% - 6px)
  max-width 240px
  margin 3px
  height auto
  position relative
  float left
  min-height 48px
  border-left 4px solid #2196F3
  box-shadow 0 3px 6px 3px rgba(1,1,1,0.4)
  background-color rgba(255, 255, 255, 0.5)
  box-shadow 4px 4px 2px rgba(0, 0, 0, 0.3)
  z-index 10
  padding 0px

.frame.frame-type-grid > .frame > img
  display none
  width 111px
  height 111px

.frame.frame-type-grid > .frame > canvas
  display inline-block
  margin 0
  padding 0
  width 111px
  height 111px

.frame.frame-type-grid > .frame > canvas.image
  width 111px
  height 111px

.frame.frame-type-grid > .frame > canvas.palette
  position absolute
  width 14%
  right 6px
  margin-top -30%
  background white



.frame.frame-type-list > .frame
  width 100%
  height 180px
  margin 6px
  position relative
  border-left 4px solid #2196F3
  box-shadow 0 3px 6px 3px rgba(1,1,1,0.4)
  background-color rgba(33, 150, 243, 0)
  background-color white
  box-shadow 4px 4px 2px rgba(0, 0, 0, 0.3)
  z-index 10
  padding 0px

.frame.frame-type-list > .frame > img
  display none
  height 11px
.frame.frame-type-list > .frame > canvas
  height 180px
  position relative
  border-left 6px solid #2196F3
  background-color white
  z-index 10
  padding 0px
.frame.frame-type-list > .frame > canvas.palette
  display none

.item-label
  position absolute
  height 30%
  padding 2px
  margin-top -30%
  width 100%
  color white
  font-size .8rem
  background-color  rgba(0, 0, 0, .35)
  z-index 12

.frame.frame-type-list > .frame > .item-label
  height 80px
  width 180px
  padding 2px
  margin-left 6px
  margin-top -80px

.sortable-ghost
  opacity 0.4
  z-index 0

.sortable-chosen
  box-shadow 10px 10px 25px rgba(0, 0, 0, 1)

.sortable-drag
  opacity 1
  box-shadow 10px 10px 25px rgba(0, 0, 0, 1)


.upload-zone {
  xposition:relative;
  xoverflow:hidden;
  xwidth:100%;
  xheight:300px;
  xbackground:transparent;
  border:4px dashed #333;
  cursor:pointer;
  /* padding:5px; color:#555; font-family:'Segoe UI'; font-weight:bold; */
}
.upload-zone:hover {
  border-color: green;
}


</style>
<!--
       ** SORTABLE OPTIONS **
        group: "name",  // or { name: "...", pull: [true, false, clone], put: [true, false, array] }
        sort: true,  // sorting inside list
        delay: 0, // time in milliseconds to define when the sorting should start
        disabled: false, // Disables the sortable if set to true.
        store: null,  // @see Store
        animation: 150,  // ms, animation speed moving items when sorting, `0` — without animation
        handle: ".my-handle",  // Drag handle selector within list items
        filter: ".ignore-elements",  // Selectors that do not lead to dragging (String or Function)
        draggable: ".item",  // Specifies which items inside the element should be draggable
        ghostClass: "sortable-ghost",  // Class name for the drop placeholder
        chosenClass: "sortable-chosen",  // Class name for the chosen item
        dragClass: "sortable-drag",  // Class name for the dragging item
        dataIdAttr: 'data-id',

        forceFallback: false,  // ignore the HTML5 DnD behaviour and force the fallback to kick in

        fallbackClass: "sortable-fallback",  // Class name for the cloned DOM Element when using forceFallback
        fallbackOnBody: false,  // Appends the cloned DOM Element into the Document's Body
        fallbackTolerance: 0 // Specify in pixels how far the mouse should move before it's considered as a drag.

        scroll: true, // or HTMLElement
        scrollFn: function(offsetX, offsetY, originalEvent) { ... }, // if you have custom scrollbar scrollFn may be used for autoscrolling
        scrollSensitivity: 30, // px, how near the mouse must be to an edge to start scrolling.
        scrollSpeed: 10, // px
        + events...
-->
