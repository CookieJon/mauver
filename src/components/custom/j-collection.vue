<template>
    <div
      ref="container"
      :class='this.myClass'
      class='frame'
    >
      <j-item
        v-for='(item, i) in value'
        :key='item.id'
        :value='value[i]'
        @click='onSelect(i, $event)' 
      ></j-item>
    
    </div>
</template>
<script>
/* eslint-disable */
  import { extend } from 'quasar'
  import Sortable from 'sortablejs'
 
  export default {
    name: 'j-collection-rubaxax',
    components: { },
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
        options: {
          animation: 150,
          ghostClass: 'sortable-ghost',  // Class name for the drop placeholder
          chosenClass: 'sortable-chosen',  // Class name for the chosen item
          dragClass: 'sortable-drag',  // Class name for the dragging item
          group: {
            name: 'general', 
            pull: 'clone', 
            revertClone: true 
          },          
          onUpdate: e => {
            console.log('collection onUpdate')
            // v-model implementation
            let tmp = extend({}, {val: this.value}).val // ^-Magic!!  ///let tmp = extend({}, this.value)
            tmp.splice(e.newIndex, 0, tmp.splice(e.oldIndex, 1)[0])
            this.$emit('input', tmp)
          },
          onSort: e=> {
            console.log('collection onSort')
            this.$emit('sort', e)
          },
          onAdd: e => {
            console.log('collection onAdd', e)
            this.$emit('add', e)
          }
        },
        sortFromIndex: null,
        sortToIndex: null
      }
    },
    mounted () {
      var me = this
      Sortable.create(this.$refs.container, this.options)
          },
    methods: {
      // item clicked
      onSelect (index, e) {
        this.$emit("select", {index, item: this.value[index]})
      },
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
    // Element is chosen
      onChoose: function (/**Event*/e) {
        this.$emit("choose", e.oldIndex)// element index within parent
      }
    
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
  overflow hidden

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
