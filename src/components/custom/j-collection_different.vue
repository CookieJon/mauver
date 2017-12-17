
<template>
  <div>
    <pre class="text-white">{{ this.model}}</pre>
   <!--  <div
      v-sortable="options.sortable"
      @sort='onArrange'

      @dragenter.stop.prevent="onDragEnter"
      @dragover.stop.prevent="onDragOver"
      @drop.stop.prevent="onDrop"
      :class="this.class"
      class="frame upload-zone"
    > -->

    <div id="first" class="container" v-dragula="colOne" service="effects">
      <div v-for="text in value">
        <span class="handle">+</span>
        <span>{{text}}</text>
      </div>
    </div>

      <j-item
        v-for='(i, item) in value'
        :item='item'
        @jon="onJon">
      </j-item>

      <j-item
        v-for='(i, item) in value'
        :item='item'
        @jon="onJon">
      </j-item>

    </div>
  </div>
</template>

<script>
  // var Bitmap = require('../../moe/moe.bitmap.js')
  var jItem = require('components/custom/j-item')
  export default {
    data () {
      return {
        myItems: null,
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
    props: {
      class: {
        type: String,
        default: 'frame-type-grid'
      },
      // v-model...
      value: {
        type: String,
        default: ''
      }
    },
    computed: {
      //  collection:
    },
    components: {
      jItem
    },

    created () {
      console.log('NAMED SERVICES: created')

      this.myItems = this.items

      let dragula = this.$dragula

      let service = dragula.createService({
        name: 'effects',
        drake: {
          copy: true
        }
      })

      // let log = console.log
      //
      // TODO: Use classlist: https://developer.mozilla.org/en/docs/Web/API/Element/classList
      // See all events here: https://github.com/bevacqua/dragula#drakeon-events
      //
      service.on({
        'effects:removeModel': ({name, el, source, dragIndex, model}) => {
          console.log('HANDLE effects:removeModel: ', name, el, source, dragIndex, model)
          el.classList.remove('ex-moved')
        },
        'effects:dropModel': ({name, el, source, target, dropIndex, model}) => {
          console.log('HANDLE effects:dropModel: ', el, source, target, dropIndex, model)
          el.classList.add('ex-moved')
        },
        accepts: ({el, target}) => {
          console.log('accepts: ', el, target)
          return true // target !== document.getElementById(left)
        },
        drag: ({el, source, target, container}) => {
          console.log('HANDLE drag: ', 'el:', el, 'c:', container)
          console.log('classList', el.classList)
          el.classList.remove('ex-moved')
        },
        drop: (opts) => {
          const {el, container, model} = opts
          console.log('HANDLE drop: ', el, container, model, opts)
          console.log('classList', el.classList)
          el.classList.add('ex-moved')
          console.log('new classList', el.classList)
        },
        over: ({el, container}) => {
          console.log('over: ', el, container)
          console.log('classList', el.classList)
          el.classList.add('ex-over')
        },
        out: ({el, container}) => {
          console.log('out: ', el, container)
          console.log('classList', el.classList)
          el.classList.remove('ex-over')
        }
      })
      console.log('DRAG EFFECTS: ready')

      console.log('NAMED SERVICES: ready')
    },
    mounted () {
      // var me = this
    },
    methods: {
      onDragEnter (e) {
        e.stopPropagation()
        e.preventDefault()
      },
      onDragOver (e) {
        e.stopPropagation()
        e.preventDefault()
      },
      onDrop (e) {
        console.log('onDrop:', e, e.dataTransfer.files)
        e.preventDefault()
        var files = e.dataTransfer.files
        for (var i = 0, l = files.length; i < l; i++) {
          var file = files[i]
          if (!file.type.match(/image.*/)) {
            console.log('File ', i, 'not an image. Won\'t create bitmap.')
          }
          else {
            // this.loadImage(file)
            console.log('File type = ', file.type)
            this.$store.dispatch('addBitmap', {file})
          }
        }
        // $vm.$refs.fileinput.files = files // this code line fires your 'fileCloadImagehanged' function (imageLoader change event)
      },
      loadImage (src) {
        //  Prevent any non-image file type from being read.
        if (!src.type.match(/image.*/)) {
          console.log('The dropped file is not an image: ', src.type)
          return
        }
        //  Create our FileReader and ru n the results through the render function.
        var reader = new FileReader()
        reader.onload = function (e) {
          this.render(e.target.result)
        }.bind(this)
        reader.readAsDataURL(src)
      },
      onJon (e) {
        // Update a property on an item
        console.log('j-collection.onUpdate()', e)
        this.$emit('jon', e)
      },
      onArrange (e) {
        console.log('j-collection.onArrange()', e)
        this.$emit('arrange', {
          obj: this.item,
          fromIndex: e.oldIndex,
          toIndex: e.newIndex
        })
        console.log(e)
      }
    }
  }
</script>

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

<style lang="stylus">

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

.ex-moved {
  animation: fadeIn 2s ease-in 1 forwards;
  border: 2px solid yellow;
  padding: 2px
}

.ex-over {
  animation: fadeIn .5s ease-in 1 forwards;
  border: 4px solid green;
  padding: 2px
}
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
  width 24%
  height 24%
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
