<template>
  <q-layout
    ref="layout"
    view="lHh Lpr fff"
    :left-class="{'bg-grey-2': true}"
    :style="bgStyle">

      
    <q-toolbar slot="header">
      <q-btn
        flat
        @click="$refs.layout.toggleLeft()"
      >
        <q-icon name="menu" />
      </q-btn>

      <q-toolbar-title>
        Quasar App
        <div slot="subtitle">Running on Quasar v{{$q.version}}</div>
      </q-toolbar-title>

    </q-toolbar>
      <!-- Navigation Tabs    -->
      <q-tabs slot="title"  position="top" >
        <q-route-tab slot="title" icon="settings_system_daydream" to="/view-mauve" replace hide="icon" label="About" />
        <q-route-tab slot="title" icon="mail" to="/view-panels" replace hide="icon" label="Toolbar" />
        <q-route-tab slot="title" icon="alarm" to="/view-sortable" replace label="Tabs" />
        <q-route-tab slot="title" icon="help" to="/view-editor" replace label="Drawer" />
      </q-tabs>




      
    <!-- <q-tabs slot="navigation" class="text-white">
      <q-tab route="/view-mauve" icon="settings_system_daydream" exact>Mauve</q-tab>
      <q-tab route="/view-panels" icon="mail" exact>Panels</q-tab>
      <q-tab route="/view-sortable" icon="alarm" exact>Sortable</q-tab>
      <q-tab route="/view-editor" icon="help" exact>Editor</q-tab>
    </q-tabs> -->
    <q-select
        type="radio"
        :value="selectedBg"
        :options="options"
        @input="onInput"
      ></q-select>


    <div slot="left">
      <!--
        Use <q-side-link> component 
        instead of <q-item> for 
        internal vue-router navigation
      -->

      <q-list no-border link inset-delimiter>
        <q-list-header>Essential Links</q-list-header>
        <q-item @click="launch('http://quasar-framework.org')">
          <q-item-side icon="school" />
          <q-item-main label="Docs" sublabel="quasar-framework.org" />
        </q-item>
        <q-item @click="launch('http://forum.quasar-framework.org')">
          <q-item-side icon="record_voice_over" />
          <q-item-main label="Forum" sublabel="forum.quasar-framework.org" />
        </q-item>
        <q-item @click="launch('https://gitter.im/quasarframework/Lobby')">
          <q-item-side icon="chat" />
          <q-item-main label="Gitter Channel" sublabel="Quasar Lobby" />
        </q-item>
        <q-item @click="launch('https://twitter.com/quasarframework')">
          <q-item-side icon="rss feed" />
          <q-item-main label="Twitter" sublabel="@quasarframework" />
        </q-item>
      </q-list>
    </div>

    <!--
      Replace following <div> with
      <router-view /> component
      if using subRoutes
    -->
    <!-- <div class="layout-padding logo-container non-selectable no-pointer-events">
      <div class="logo" :style="position">
        <img src="~assets/quasar-logo-full.svg">
      </div>
    </div> -->
    <keep-alive>
      <router-view> </router-view>
    </keep-alive>    
  </q-layout>
</template>
<script>

/* eslint-disable */
import {
  dom,
  event,
  openURL,
  QLayout,
  QToolbar,
  QToolbarTitle,
  QBtn,
  QIcon,
  QList,
  QListHeader,
  QItem,
  QItemSide,
  QItemMain,
  QSelect,
  QTabs,
  QTab,
  QRouteTab
} from 'quasar'

const
  { viewport } = dom, 
  { position } = event,
  moveForce = 30,
  rotateForce = 40,
  RAD_TO_DEG = 180 / Math.PI

  function getRotationFromAccel (accelX, accelY, accelZ) {
/* Reference: http://stackoverflow.com/questions/3755059/3d-accelerometer-calculate-the-orientation#answer-30195572 */
  const sign = accelZ > 0 ? 1 : -1
  const miu = 0.001

  return {
    roll: Math.atan2(accelY, sign * Math.sqrt(Math.pow(accelZ, 2) + miu * Math.pow(accelX, 2))) * RAD_TO_DEG,
    pitch: -Math.atan2(accelX, Math.sqrt(Math.pow(accelY, 2) + Math.pow(accelZ, 2))) * RAD_TO_DEG
  }
}

export default {
  name: 'index',
  components: {
    QLayout,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QList,
    QListHeader,
    QItem,
    QItemSide,
    QItemMain,
    QSelect,
    QTabs,
    QTab,
    QRouteTab
  },
  data () {
    return {
      orienting: window.DeviceOrientationEvent && !this.$q.platform.is.desktop,
      rotating: window.DeviceMotionEvent && !this.$q.platform.is.desktop,
      moveX: 0,
      moveY: 0,
      rotateY: 0,
      rotateX: 0,
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
      position () {
        const transform = `rotateX(${this.rotateX}deg) rotateY(${this.rotateY}deg)`
        return {
          top: this.moveY + 'px',
          left: this.moveX + 'px',
          '-webkit-transform': transform,
          '-ms-transform': transform,
          transform
        }
      },
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
    methods: {
      onInput (e) {
        this.selectedBg = e
        console.log(e)
      },    
      launch (url) {
        openURL(url)
      },
      move (evt) {
        const
          {width, height} = viewport(),
          {top, left} = position(evt),
          halfH = height / 2,
          halfW = width / 2

        this.moveX = (left - halfW) / halfW * -moveForce
        this.moveY = (top - halfH) / halfH * -moveForce
        this.rotateY = (left / width * rotateForce * 2) - rotateForce
        this.rotateX = -((top / height * rotateForce * 2) - rotateForce)
      },
      rotate (evt) {
        if (evt.rotationRate &&
            evt.rotationRate.beta !== null &&
            evt.rotationRate.gamma !== null) {
          this.rotateX = evt.rotationRate.beta * 0.7
          this.rotateY = evt.rotationRate.gamma * -0.7
        }
        else {
          /* evt.acceleration may be null in some cases, so we'll fall back
            to evt.accelerationIncludingGravity */
          const
            accelX = evt.acceleration.x || evt.accelerationIncludingGravity.x,
            accelY = evt.acceleration.y || evt.accelerationIncludingGravity.y,
            accelZ = evt.acceleration.z || evt.accelerationIncludingGravity.z - 9.81,
            rotation = getRotationFromAccel(accelX, accelY, accelZ)

          this.rotateX = rotation.roll * 0.7
          this.rotateY = rotation.pitch * -0.7
        }
      },
      orient (evt) {
        if (evt.beta === null || evt.gamma === null) {
          window.removeEventListener('deviceorientation', this.orient, false)
          this.orienting = false

          window.addEventListener('devicemotion', this.rotate, false)
        }
        else {
          this.rotateX = evt.beta * 0.7
          this.rotateY = evt.gamma * -0.7
        }
      }
    },
    mounted () {
      this.$nextTick(() => {
        if (this.orienting) {
          window.addEventListener('deviceorientation', this.orient, false)
        }
        else if (this.rotating) {
          window.addEventListener('devicemove', this.rotate, false)
        }
        else {
          document.addEventListener('mousemove', this.move)
        }
      })
    },
    beforeDestroy () {
      if (this.orienting) {
        window.removeEventListener('deviceorientation', this.orient, false)
      }
      else if (this.rotating) {
        window.removeEventListener('devicemove', this.rotate, false)
      }
      else {
        document.removeEventListener('mousemove', this.move)
      }
    }
}
</script>

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
.logo-container
  width 255px
  height 242px
  perspective 800px
  position absolute
  top 50%
  left 50%
  transform translateX(-50%) translateY(-50%)
.logo
  position absolute
  transform-style preserve-3d
</style>
