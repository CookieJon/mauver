<template>
    <div
      ref="container"
      @sort='onSort'
      @add='onAdd'
      @clone='onClone'
      @update='onUpdate'
      @choose='onChoose'
      @remove='onRemove'
      :class='this.myClass'
      class='frame'
    >
      <j-item
        v-for='item, i in value'
        :key='item.id'
        @click='onClickItem(i, $event)' 
        :value='value[i]'
        xvalue='$state.repo[item.repo][item.key]||null'>
      </j-item>
    
    </div>
</template>
<script>
/* eslint-disable */
  // var Bitmap = require('../../moe/moe.bitmap.js')
  var jItem = require('components/custom/j-item')
  var jDebug = require('components/custom/j-debug')
  import { extend } from 'quasar'
  import Sortable from 'sortablejs'
  import draggable from 'vuedraggable'
 
  export default {
    name: 'j-collection-rubaxax',
    components: {
      jItem, jDebug, draggable
    },
    props: {
      value: {
        type: [Array, Object]
      },
      myClass: {
        type: String,
        default: 'frame-type-grid'
      }
    },
    data () {
      return {
        test: extend({}, this.value),
        //myValue:  extend({}, this.value),
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
      var me = this
      Sortable.create(this.$refs.container,
        { 
          group: {
            name: "omni", 
            pull: 'clone', 
            revertClone: true 
          },
          animation: 100
        })
    },
    methods: {

      // Called by any change to the list (add / update / remove)
      onSort: function (/**Event*/e) {
        // same properties as onEnd
        console.log('onSort',e)
      },
      
      // sortablejs events.. 
      // Element is dropped into the list from another list
      onAdd: function (/**Event*/e) {
        console.log('onAdd',e)
        this.$emit("add", e)
        // same properties as onEnd
      },

      // Changed sorting within list
      // onUpdate: function (/**Event*/e) {
      //   // same properties as onEnd
      //   // this.$emit("add", this.value[index])
      // },

      // Element is removed from the list into another list
      onRemove: function (/**Event*/e) {
        // same properties as onEnd
        console.log('onRemove',e)
        this.$emit("add", e)
      },      
      // Called when creating a clone of element
      onClone: function (/**Event*/e) {
        var origEl = e.item;
        var cloneEl = e.clone;
        this.$emit("clone", e)
        console.log('onClone',e)
      },
      onUpdate (e) {
        let tmp = extend({}, {val: this.value}).val
        // ^-Magic!!  ///let tmp = extend({}, this.value)
        tmp.splice(e.newIndex, 0, tmp.splice(e.oldIndex, 1)[0])
        this.$emit('input', tmp)
        console.log('input.--update',e)
        // this.$emit('arrange', {
        //   obj: this.item,
        //   fromIndex: e.oldIndex,
        //   toIndex: e.newIndex
        // })
        // console.log(e)
      },
    // Element is chosen
      onChoose: function (/**Event*/e) {
        this.$emit("choose", e.oldIndex)// element index within parent
      },      
      onClickItem (index, e) {
        this.$emit("clickItem", this.value[index])
      },
    
    }
  }
</script>

<style lang="stylus">

.ui-resizable
  position absolute

/* frame-type-grid */
.frame.frame-type-grid
  padding 5px
  background-color #f0f0f0
  min-height 45px
  width 100%

.frame.frame-type-grid > .frame
  width calc(15% - 6px)
  width 64px
  xmax-width 240px
  margin 3px
  height auto
  position relative
  float left
  min-height 48px
  border 2px solid #333
  //border-left 4px solid #2196F3
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
  height 16px
  padding 2px
  bottom 0
  width 100%
  color white
  font-size .6rem
  background-color  rgba(0, 0, 0, .47)
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
  height:100%;
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
