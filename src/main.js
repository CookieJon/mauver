// === DEFAULT / CUSTOM STYLE ===
// WARNING! always comment out ONE of the two require() calls below.
// 1. use next line to activate CUSTOM STYLE (./src/themes)
require(`./themes/app.${__THEME}.styl`)
// 2. or, use next line to activate DEFAULT QUASAR STYLE
// require(`quasar/dist/quasar.${__THEME}.css`)
// ==============================

// Uncomment the following lines if you need IE11/Edge support
// require(`quasar/dist/quasar.ie`)
// require(`quasar/dist/quasar.ie.${__THEME}.css`)

import Vue from 'vue'
import Quasar from 'quasar'
import router from './router'
import store from './store'
import Croppa from 'vue-croppa'

Vue.config.productionTip = false

Vue.use(Quasar) // Install Quasar Framework
Vue.use(store)
Vue.use(Croppa)

// Moe Cusatom Components
import jArtwork from 'components/custom/j-artwork'
import jBitmap from 'components/custom/j-bitmap'
import jCanvas from 'components/custom/j-canvas'
import jCollection from 'components/custom/j-collection'
import jItem from 'components/custom/j-item'
import jLever from 'components/custom/j-lever'
import jObject from 'components/custom/j-object'
import jPanel from 'components/custom/j-panel'
import jUploadZone from 'components/custom/j-upload-zone'

Vue.mixin({
  components: {
    jArtwork, jBitmap, jCanvas, jCollection, jItem, jLever, jObject, jPanel, jUploadZone
  }
})

if (__THEME === 'mat') {
  require('quasar-extras/roboto-font')
}
import 'quasar-extras/material-icons'
// import 'quasar-extras/ionicons'
// import 'quasar-extras/fontawesome'
// import 'quasar-extras/animate'

require('quasar-framework/dist/quasar.mat.css')

Quasar.start(() => {
  /* eslint-disable no-new */
  new Vue({
    el: '#q-app',
    router,
    store,
    render: h => h(require('./App'))
  })
})
