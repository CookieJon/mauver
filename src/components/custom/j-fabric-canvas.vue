<template lang='pug'>
  //- Fabric is loaded in main.html as a CSN because node version has too many dependencies.
  div.drop-container(ref='canvasDropContainer')  
    canvas(id='c' width='256' height='256')  
    //- div.text-white|{{canvasOptions}}  
</template>

<script>
  /* eslint-disable */
  import { extend } from 'quasar'
  import Sortable from 'sortablejs'
  import MoeUtils from '../../moe/utils/moe.utils.js'
  import Factory from '../../moe/objects/moe.factory.js'

  var canvas


  // BITMAP OBJECT
  //

  var BitmapObject = fabric.util.createClass(fabric.Image, {

    type: 'bitmapObject',

    needsItsOwnCache: ()=>true,

    initialize: function(img, options) {
      this.callSuper('initialize', img, options);

      this.loaded = false
      // Create the bitmap
      this.bitmap = Factory.bitmapFromImg(img, 0, 22)
      // Bitmap preview
      this._bitmapImg = MoeUtils.imageFromBitmap(this.bitmap) 
      this._paletteImg = MoeUtils.imageFromColors(this.bitmap.palette.colors)

      // apply filters and re-render canvas when done

      // // add image onto canvas
      // canvas.add(img);

      // var rect1 = new fabric.Rect({
      //   width: 200, height: 100, left: 0, top: 50, angle: 30,
      //   fill: 'rgba(255,0,0,0.5)'
      // });
      // console.log('I AM ', this)
      // console.log('C', canvas, 'CC', this.canvas, canvas === this.canvas)
      // canvas.add(rect1)

      this._bitmapImg.onload = (function() {
        this.set('dirty', true)
        //this.dirty = true
        canvas.renderAll.bind(canvas)()
      }).bind(this)

      this._paletteImg.onload = (function() {
        this.set('dirty', true)
        //this.dirty = true
        canvas.renderAll.bind(canvas)()
      }).bind(this)

    },

    toObject: function() {
      return fabric.util.object.extend(this.callSuper('toObject'), {
        label: this.get('label')
      });
    },
    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _render: function(ctx) {
      if (this.isMoving === false && this.resizeFilter && this._needsResize()) {
        this._lastScaleX = this.scaleX;
        this._lastScaleY = this.scaleY;
        this.applyResizeFilters();
      }
      this._stroke(ctx);
      //this._renderPaintInOrder(ctx);
       ctx.drawImage(this._bitmapImg, -128, -128)
    },
    // _render: function(ctx) {

    //   console.log('_render', this.dirty, this.filters)
    //   //this.applyFilters();
    //   if (this.isMoving === false && this.resizeFilter && this._needsResize()) {
    //     this._lastScaleX = this.scaleX;
    //     this._lastScaleY = this.scaleY;
    //     this.applyResizeFilters();
    //   }
    //   // this._stroke(ctx);
    //   // this._renderPaintInOrder(ctx);

    //   // ctx.drawImage(this._originalElement, -128, -128)
    //   // ctx.drawImage(this._paletteImg, 0, -128)
      
    //   ctx.drawImage(this._bitmapImg, -128, -128)
    // },


  });


  export default {
    name: 'j-fabric-canvas',
    props: {
      // value: Array of canvas' getObjects()
      //
      value: { 
        type: Array
      },
      // options: canvas-level options
      //
      canvasOptions: {
        type: Object,
        default () {
          return {
            isDrawingMode: false,
            preserveObjectStacking: false,
            imageSmoothingEnabled: false
          }
        }
      }
    },
    watch: {
      canvasOptions: {
        handler: function(val, oldVal) {
          console.log("WATCH ==> fabric canvas options", val, oldVal)

          canvas.isDrawingMode = val.isDrawingMode
          canvas.preserveObjectStacking = val.preserveObjectStacking
          canvas.imageSmoothingEnabled = val.imageSmoothingEnabled
        },
        deep: true
      }
    },
    computed: {
      myValue () {
        console.log('fabric myValue computed')
        let out = extend({}, this.value)
      }
    },
    
    data () {
      let self = this // <- the j-collection component
      return {
        options: {
          test: 'jon',
          animation: 50,
          sort: false,
          scroll: false,
          ghostClass: 'sortable-ghost',  // Class name for the drop placeholder
          chosenClass: 'sortable-chosen',  // Class name for the chosen item
          dragClass: 'sortable-drag',  // Class name for the dragging item
          group: {
            name: 'general',
            pull: 'clone',
            revertClone: true
          },
        }
      }
    },

    mounted () {

      self = this

      // Sortable on container purely to drop objs from other sortables.
      let rubaxa = Sortable.create(this.$refs.canvasDropContainer, extend(true, {}, this.options, {
        // Rubaxa sortable drop event -->
        onAdd: function(e) {
          e.clone.obj = e.clone.objs[e.oldIndex]
          e.item.remove()
          let img = MoeUtils.imageFromBitmap(e.clone.obj)
          img.onload = ()=>self.addImage(img)
          return false
          }
        }
      )
    )

    // Init fabric canvas
    canvas = new fabric.Canvas('c')
    canvas.setHeight('100%', {cssOnly: true})
    canvas.setWidth('100%', {cssOnly: true})
    canvas.isDrawingMode = false
    canvas.preserveObjectStacking = false
    canvas.imageSmoothingEnabled= false      
    canvas.freeDrawingBrush.color = '#ff0000'
    canvas.freeDrawingBrush.width = 30
    //canvas.backgroundColor='white'  
  
    canvas.on('object:modified', function(e) {
      console.log('object:modified', e)
      self.__sync()
    });      

    canvas.on('object:added', function(e) {
      console.log('object:added', e)
      self.__sync()
    });      

    canvas.on('mouse:move', function(e) {
      canvas.lastX = e.e.offsetX
      canvas.lastY = e.e.offsetY
      // console.log('mouse:move', e.e.offsetX, e.e.offsetY)
      //self.__sync()
    });       

  },    
    methods: {

      doCommand(command, args) {
        canvas[command].call(...args)
      },

      __sync() {
        // Re-render canvas, and emit $input event for v-model
        //  
        //canvas.requestRenderAll() 
        canvas.renderAll()
        //
        // let out = JSON.parse( JSON.stringify( canvas.getObjects() ) ) 
        let out = extend(true, {}, {value: canvas.getObjects()}).value
        this.$nextTick(()=>self.$emit("input", out))
        console.log('Fabric synced') 
      },

      addImage(img) {

        var oBitmap = new BitmapObject(img, {
            label: 'Hi there',
            width: img.width,
            height: img.height,
            left: 10,
            top: 10,
            scaleX: .4,
            scaleY: .4,
            objectCaching: true
            // statefullCache: false,
            // noScaleCache: false,
        })    
        var f = new fabric.Image.filters.Convolute({
              matrix: [ 0, -1, 0, -1, 5, -1, 0, -1, 0 ]
            })
        var s = new fabric.Image.filters.Sepia()
        console.log('oBitmap', oBitmap)
        //oBitmap.filters.push(f)
        // oBitmap.filters.push(new fabric.Image.filters.Sepia());


        var circle1 = new fabric.Circle({	  radius: 10,	  fill: 'red',	  left: -40	,objectCaching: true});
        var circle2 = new fabric.Circle({	  radius: 10,	  fill: 'blue',	  left: 40	,objectCaching: true});
        var circle3 = new fabric.Circle({	  radius: 10,	  fill: 'green',	  left: 0		,objectCaching: true});

        circle2.needsItsOwnCache = ()=>true 

        var group = new fabric.Group([  oBitmap, circle2, circle3 ],)

        group.setOptions({
          left: (255 * canvas.lastX / canvas.wrapperEl.offsetWidth) - (group.width / 2) ,
          top: (255 * canvas.lastY / canvas.wrapperEl.offsetHeight) - (group.width / 2)
        })

        console.log('addImage', group)


        var test = new fabric.Image(img, {
          label: 'Hi there',
          width: img.width,
          height: img.height,
          left: 10,
          top: 10,
          scaleX: .4,
          scaleY: .4,
          objectCaching: true
          // statefullCache: false,
          // noScaleCache: false,
        })    
        test.filters.push(s);
        test.applyFilters();
        
        oBitmap.filters.push(s);
        oBitmap.applyFilters();
        this.$nextTick(()=>{
          canvas.add(test)
          canvas.add(group)
        })
 

        // //oBitmap.set('objectCaching', true)

        // var oMask = new Image(img, {
        //     width: img.width,
        //     height: img.height,
        //     left: 10,
        //     top: 10,
        //     scaleX: .4,
        //     scaleY: .4,
        //     objectCaching: true
        //     // statefullCache: false,
        //     // noScaleCache: false,
        // })     


        // var group = new fabric.Group([oBitmap, oMask])
        // // group.addWithUpdate(oBitmap)
        // // group.addWithUpdate(oMask)

 
        //this.__sync()
      },

      selectObject(i) {
        
        let a = canvas.getActiveObject()
        let b = canvas.getActiveObjects()
        canvas.discardActiveObject()        
        var sel = new fabric.ActiveSelection([canvas.getObjects()[i]], {
          canvas: canvas,
        });
        canvas.setActiveObject(sel)
        canvas.requestRenderAll();
        console.log('select object', i)
      },

      selectAll() {
        canvas.discardActiveObject();
        var sel = new fabric.ActiveSelection(canvas.getObjects(), {
          canvas: canvas,
        });
        canvas.setActiveObject(sel);
        canvas.requestRenderAll();
      },

      selectNone() {
        canvas.discardActiveObject();
        canvas.requestRenderAll();
      },

      removeSelected() {
        var activeObjects = canvas.getActiveObjects()
        canvas.discardActiveObject()
        if (activeObjects.length) {
          canvas.remove.apply(canvas, activeObjects)
        }
        this.__sync()
      },

      group () {
        if (!canvas.getActiveObject()) {
          return;
        }
        if (canvas.getActiveObject().type !== 'activeSelection') {
          return;
        }
        canvas.getActiveObject().toGroup();
        canvas.requestRenderAll();
        // self.$emit("input", this.myValue)
      },

      ungroup () {
        if (!canvas.getActiveObject()) {
          return;
        }
        if (canvas.getActiveObject().type !== 'group') {
          return;
        }
        canvas.getActiveObject().toActiveSelection();
        canvas.requestRenderAll();
      },

        // q-btn(icon='' @click='$refs.fabric.bringForward()')|>
        // q-btn(icon='' @click='$refs.fabric.sendBackward()')|<
        // q-btn(icon='' @click='$refs.fabric.bringToFront()')|>>
        // q-btn(icon='' @click='$refs.fabric.sendToBack()')|<<

      bringForward () {
        if (!canvas.getActiveObject()) {
          return;
        }
        canvas.bringForward(canvas.getActiveObject())
        canvas.requestRenderAll()
      },
      sendBackwards () {
        if (!canvas.getActiveObject()) {
          return;
        }
        canvas.sendBackwards(canvas.getActiveObject())
        canvas.requestRenderAll()
      },      
      bringToFront () {
        if (!canvas.getActiveObject()) {
          return;
        }
        canvas.bringToFront(canvas.getActiveObject())
        canvas.requestRenderAll()
      },      
      sendToBack () {
        if (!canvas.getActiveObject()) {
          return;
        }
        canvas.sendToBack(canvas.getActiveObject())
        canvas.requestRenderAll()
      },

      centerObject () {
        if (!canvas.getActiveObject()) {
          return;
        }
        canvas.centerObject(canvas.getActiveObject())
        //canvas.requestRenderAll()
      },
      centerObjectH () {
        if (!canvas.getActiveObject()) {
          return;
        }
        canvas.centerObjectH(canvas.getActiveObject())
        canvas.requestRenderAll()
      },
      centerObjectV () {
        if (!canvas.getActiveObject()) {
          return;
        }
        canvas.centerObjectV(canvas.getActiveObject())
        canvas.requestRenderAll()
      },            
      clear () {
        canvas.clear(canvas)
        canvas.backgroundColor='white'  
        canvas.requestRenderAll()
        this._sync()
      // self.$emit("input", this.myValue)
      },    

      fill () {
        if (!canvas.getActiveObject()) {
          return;
        }
        let obj = canvas.getActiveObject()
        obj.setOptions({scaleX: obj.width / 256, scaleY: obj.height / 256, angle:0, top:0, left:0})
        canvas.requestRenderAll()
      },
      halve () {
        if (!canvas.getActiveObject()) {
          return;
        }
        let obj = canvas.getActiveObject()
        obj.setOptions({width: obj.width/2, height:obj.height/2})
        canvas.requestRenderAll()
      },
      straighten () {
        if (!canvas.getActiveObject()) {
          return;
        }
        canvas.getActiveObject().straighten()
        canvas.requestRenderAll()
      },            
    }
  } 
  


</script>

<style lang="stylus">
.canvas-container,
.drop-container
    overflow: hidden;
    -webkit-box-flex: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: nowrap;
    flex-wrap: nowrap;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;

.ui-resizable
  position absolute

/* frame-type-grid */
.frame.frame-type-droptarget
  padding 5px
  background-color rgba(0, 0, 0, 0.3)
  width 100px
  height 100px

  &.selected
    border 2px solid white !important


.frame.frame-type-droptarget > .frame

  position relative
  xfloat left
  min-height 48px
  border 2px solid #333
  //border-left 4px solid #2196F3
  box-shadow 0 3px 6px 3px rgba(1,1,1,0.4)
  background-color rgba(0, 0, 0, 0.3)
  box-shadow 4px 4px 2px rgba(0, 0, 0, 0.3)
  z-index 10
  padding 0px

.frame > .frame > img
  display none
  width 111px
  height 111px

.frame > .frame > canvas
  display inline-block
  margin 0
  padding 0
  width 111px
  height 111px

.frame > .frame > canvas.image
  width 111px
  height 111px

.frame > .frame > canvas.palette
  position absolute
  width 14%
  right 6px
  margin-top -30%
  background white



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


.sortable-ghost
  display none
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
