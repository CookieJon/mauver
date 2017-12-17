<style>
#drop {
  min-height: 150px;
  width: 250px;
  border: 1px solid blue;
  margin: 10px;
  padding: 10px;
}
</style>
 <template>
  <!-- root node required -->
  <div>

    <!-- your content -->
    <div class="layout-padding">

      <!-- PANEL :: DEBUG -->
      <j-panel title='Debug' width="380" height="750" x="5" y="5">
        <pre slot="content" class='text-white'>{{ store.state | json 2 }}</pre>
        <pre slot="content" class='text-white'>{{ $store.state | json 2 }}</pre>
      </j-panel>


      <j-panel
        title="Bitmap Detail"
        icon="upload"
         :width="370" :height="140" :x="320" :y="635">
        >
        <div slot="content">
          <q-range :model.sync="number" :min="1" :max="1000" class='rotate-90'></q-range>
        </div>
      </j-panel>

      <!-- PANEL :: BITMAPS -->
      <j-panel
        title="Bitmaps"
        icon="business"
         :width="320" :height="520" :x="380" :y="25">
        >
          <div slot="header" class='j-panel-toolbar text-black' style='padding:4px;'>
            <button class="circular primary small" @click='addBitmap'><i>add</i></button>
            <button class="circular primary small" @click='loadBitmap'><i>file_upload</i></button>
          </div>

          <div slot="content" class="j-tray area panel-item-grow">
         <!--    <j-collection
              :model="store.state.bitmaps"
              @jon="onUpdateBitmap"
              @arrange="onArrangeBitmap"
              class='frame-type-grid'
            ></j-collection> -->
          </div>
      </j-panel>

              <!--
              :options="" -->
      <!-- PANEL :: ARTWORK PREVIEW -->
      <j-panel
        title="Artwork"
        icon="android"
         :width="256" :height="256" :x="520" :y="35">
        >
<!--           <div slot="content" class="j-tray area panel-item-grow">
            <j-canvas :imgdata='activeBitmap.img' :width="256" :height="256" ></j-canvas>
          </div> -->
      </j-panel>



    </div><!-- your content -->

  </div><!-- root node required -->

</template>



<script>
/**
 *
 * START SCRIPT
 *
 **/
var jPanel = require('components/custom/j-panel')
var jItem = require('components/custom/j-item')
var jCanvas = require('components/custom/j-canvas')
var jCollection = require('components/custom/j-collection')
var jUploadZone = require('components/custom/j-upload-zone')

// import MoeStore from '../../moe/moe.store.js'

// import { addBitmap, updateBitmap } from '../../store/actions'
export default {
  data () {
    return {
      store: { a: 1 }, // MoeStore,
      'testBitmaps': [
        '/statics/img/resource/bg/more1.png',
        '/statics/img/resource/bg/more2.png',
        '/statics/img/resource/bg/bg2.png'
      ],
      'building': {
        'levels': {
          'id': {
            'id': null,
            'spaces': {
              'artwork': null,
              'other': {
                key: null,
                exits: null
              }
            }
          }
        },
        'artworks': {
          'id': {
            id: null,
            filters: []
          }
        },
        'baitmaps': {
          'id': {
            id: null,
            filters: []
          }
        },
        'palettes': {
        }
      },
      'chipsArray': [],
      'test_range': { min: 10, max: 90 },
      'jon': 1,
      'artworks': {},
      'selected': null
    }
  },
  computed: {
    all () {
      return this.$store.getters.all
    },
    bitmaps () {
      return this.$store.getters.bitmaps
    },
    activeBitmap () {
      return this.$store.getters.activeBitmap
    }
  },
  components: {
    jPanel, jItem, jCanvas, jUploadZone, jCollection
  },
  methods: {
    addBitmap (e) {
      this.$store.dispatch('addBitmap')
    },
    loadBitmap (e) {
      this.$store.dispatch('loadBitmap')
    },
    cloneBitmap (e) {

    },
    selectBitmap (e) {
    },
    onUpdateBitmap (e) {
      this.$store.dispatch('updateBitmap', e)
    },
    onArrangeBitmap (e) {
      this.$store.dispatch('arrangeBitmap', e)
    }
  },
  ready () {
    console.log('STORE', this.all)
  }
}
</script>
