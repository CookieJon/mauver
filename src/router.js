import Vue from 'vue'
import VueRouter from 'vue-router'

/* eslint-disable */
Vue.use(VueRouter)

function load (component) {
  // '@' is aliased to src/components
  return () => System.import(`@/${component}.vue`)
}

export default new VueRouter({
  /*
   * NOTE! VueRouter "history" mode DOESN'T works for Cordova builds,
   * it is only to be used only for websites.
   *
   * If you decide to go with "history" mode, please also open /config/index.js
   * and set "build.publicPath" to something other than an empty string.
   * Example: '/' instead of current ''
   *
   * If switching back to default "hash" mode, don't forget to set the
   * build publicPath back to '' so Cordova builds work again.
   */

  routes: [

    // Default
    {
      path: '/*',
      component: load('layouts/layout-mauver'),
      children: [
        {
          path: '/*',
          component: load('views/view-mauve')
        },
        {
          path: '/view-vip',
          component: load('views/view-vip')
        },
        {
          path: '/view-panels',
          component: load('views/view-panels')
        },
        {
          path: '/view-sortable',
          component: load('views/view-sortable')
        },
        {
          path: '/view-editor',
          component: load('views/view-editor')
        }
      ]
    },

    // { path: '/', component: load('views/view-mauve') },
    // { path: '/', component: load('Hello') },
    // { path: '/', component: load('editor') },
    // { path: '/', component: load('layouts/layout-main') },

    // Always leave this last one
    { path: '*', component: load('Error404') } // Not found
  ]
})
