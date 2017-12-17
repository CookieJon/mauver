<template>
  <q-layout v-bind:style="bgStyle">

 <!--
  <div slot="header" class="toolbar bg-primary shadow-2 z-marginal-plus-1">
    <button>
      <i>menu</i>
    </button>
    <button class="left-drawer-opener">
      <i>menu</i>
    </button>e
    <q-toolbar-title :padding="3">
      quaZ-APP!

    </q-toolbar-title>

    <button>
      <i>mail</i>
    </button>
    <button>
      <i>alarm</i>
    </button>
  </div>
-->

     <!-- Navigation Tabs    -->
       <q-tabs slot="navigation" class="text-white">
        <q-tab route="/view-mauve" icon="settings_system_daydream" exact>Mauve</q-tab>
        <q-tab route="/view-panels" icon="mail" exact>Panels</q-tab>
        <q-tab route="/view-sortable" icon="alarm" exact>Sortable</q-tab>
        <q-tab route="/view-editor" icon="help" exact>Editor</q-tab>
      </q-tabs>
    <q-select
        type="radio"
        :value="selectedBg"
        :options="options"
        @input="onInput"
      ></q-select>


   <!-- FABS -->
 <!--      <q-fab type="indigo" style="margin:40px 20px " icon="collections" direction="right" class="fixed-top-left">
        <q-small-fab class="white" @click="this.openModal()">mail</q-small-fab>
        <q-small-fab class="white" @click="toast('alarm')">alarm</q-small-fab>
      </q-fab> -->


      <!-- <div class="layout-view no-scroll">keep-alive>-->
      <keep-alive>
        <router-view> </router-view>
      </keep-alive>
    </div>
  </q-layout>
</template>

<script>
//  import { Modal } from 'quasar'
//  import modalTemplate from '../modal_layout.html'
//  var modal
  export default {
    data () {
      return {
        // 'selectedBg': '/statics/img/resource/bg/tron/tron7.jpg',
        'selectedBg': '/statics/img/resource/bg/tron/tron1.png',
        'bgs': [
          '',
          '/statics/img/resource/bg/tron/tron1.png',
          '/statics/img/resource/bg/tron/tron2.jpg',
          '/statics/img/resource/bg/tron/tron3.jpg',
          '/statics/img/resource/bg/tron/tron4.jpg',
          '/statics/img/resource/bg/tron/tron5.jpg',
          '/statics/img/resource/bg/tron/tron6.jpg',
          '/statics/img/resource/bg/tron/tron7.jpg',
          '/statics/img/resource/bg/tron/tron8.jpg',
          '/statics/img/resource/bg/tron/tron9.jpg',
          '/statics/img/resource/bg/tron/tron10.jpg',
          '/statics/img/resource/bg/tron/tron11.jpg',
          '/statics/img/resource/bg/tron/tron12.jpg',
          '/statics/img/resource/bg/tron/tron13.jpg',
          '/statics/img/resource/bg/bg2.png',
          '/statics/img/resource/bg/bg3.png',
          '/statics/img/resource/bg/bg4.png',
          '/statics/img/resource/bg/bg5.png',
          '/statics/img/resource/bg/bg6.png',
          '/statics/img/resource/bg/bg7.png',
          '/statics/img/resource/bg/bg8.png',
          '/statics/img/resource/bg/bg10.png'
        ]
      }
    },
    computed: {
      'bgStyle' () {
        return {
          'background-color': 'white',
          'background-image': 'url(' + this.selectedBg + ')'
        }
      },
      'options' () {
        var opts = []
        console.log(this.bgs.length + '!!')
        for (var i = 0, l = this.bgs.length; i < l; i++) {
          var t = this.bgs[i]
          opts.push({ 'label': t, 'value': t })
        }
        console.log(opts.length + 'ssss!')
        return opts
      }
    },
    mounted () {
      console.log(this.options + ' !!!;')
    },
    methods: {
      onInput (e) {
        this.selectedBg = e
        console.log(e)
      }
    }
    // ,
//    ready () {
//      modal = Modal.create({
//        template: modalTemplate // '#modal1' // see below for template
//      }).set({
//        closeWithBackdrop: true,
//        mininized: true
//      })
//      .css({
//        minWidth: '26vw',
//        minHeight: '80vh'
//      })
//      console.log(modalTemplate)
//    },
//    methods: {
//      openModal () {
//        console.log('hi')
//        modal.open()
//      }
//    }
  }
</script>

<style lang="css">

.ripple {
  position: absolute;
  background: rgba(0,0,0,.25);
  border-radius: 100%;
  transform: scale(0);
  pointer-events: none;
}

.ripple.show {
  animation: ripple .5s ease-out;
}
@keyframes
ripple { to {
 transform: scale(2);
 opacity: 0;
}
}
</style>

<style lang="stylus">

  .layout
    xbackground url("/statics/img/resource/bg/bg3.png") no-repeat 50% 0px
    background-attachment fixed
    background-size cover/* cover || contain  */
    background-color black
    overflow hidden
  .layout-view
    scroll none
  .bg-glass
    background rgba(30, 30, 30, .3)

  .layout-header
    z-index 11 !important

</style>
