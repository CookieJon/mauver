<style>

  .upload-zone {
    position:relative;
    overflow:hidden;
    width:100%;
    height:300px;
    background:transparent;
    border:2px dashed #333;
    cursor:pointer; padding:5px; color:#555; font-family:'Segoe UI'; font-weight:bold;
  }
  .upload-zone:hover {
    border-color: green;
  }

  .file-upload{
    display:none;
  }

  .upload-zone img {
    position:absolute;
    width:312px;
    height:362px;
    top:-1px;
    left:-1px;
    z-index:-1;
    border:none;
    background-color: #eee;
  }
</style>

 <template>
  <div>
    <div
      vref="container"
      :class='computedClass'
      @click.stop.prevent="doContainerClick"
      @dragenter.stop.prevent="doDragEnter"
      @dragover.stop.prevent="doDragOver"
      @drop.stop.prevent="doDrop"
    >
      Drag imgs here
      <img
        ref="img"
        id="photo"
        src=""
      />
    </div>
    <input
      type="file"
      ref="fileinput"
      class="file-upload"
      name="userprofile_picture"
      @change.stop.prevent="doSelect"
    />

  </div>
</template>

<script>
  var iq = require('image-q')
  console.log(iq)
  export default {
    props: {
      'cssClass': {
        type: String,
        default: ''
      }
    },
    data () {
      return {}
    },
    computed: {
      computedClass () {
        return ['upload-zone', this.cssClass]
      }
    },
    methods: {
      doContainerClick (e) {
        this.$refs.fileinput.click()
      },
      doDragEnter (e) {
        e.stopPropagation()
        e.preventDefault()
      },
      doDragOver (e) {
        e.stopPropagation()
        e.preventDefault()
      },
      doDrop (e) {
        // User drag-dropped from file explorer to dropzone
        console.log('onDrop:', e)
        this.__addBitmaps(e.dataTransfer.files)
      },
      doSelect (e) {
        // User selected files from the fileupload
        this.__addBitmaps(e.target.files)
      },

      __addBitmaps (files) {
        // Add the dropped or selected files
        for (let i = 0; i < files.length; i++) {
          let file = files[i]
          if (file.type.match(/image.*/)) {
            this.$actions.addBitmap({file})
          }
          else {
            alert('File not an image.')
          }
        }
      },

      loadImage (src) {
        // Prevent any non-image file type from being read.
        debugger
        if (!src.type.match(/image.*/)) {
          alert(src.type)
          console.log('The dropped file is not an image: ', src.type)
          return
        }
        // Create our FileReader and run the results through the render function.
        var reader = new FileReader()
        reader.onload = function (e) {
          this.render(e.target.result)
        }.bind(this)
        reader.readAsDataURL(src)
      }
    }
  }
</script>
