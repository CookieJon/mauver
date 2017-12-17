<template lang="pug">
  div
      j-lever(v-model='$state.leverValue', rest='50%', :markers='true', :labelAlways='true', :range={
        'min': -10000,
        '35%': -1200,
        '45%': -100,
        '50%': 0,
        '55%': 100,
        '65%': 1200,
        'max': 10000}		
      )     
      p
        |[{{ $state.leverValue }}]
      <input v-model.number="number" type="number" step="20">
</template>



<script>
/* eslint-disable */
// import Utils from '../../utils'
// import { Utils } from 'quasar'
// import { Platform } from 'quasar'
// const TWEEN = require('es6-tween')


var jLever = require('components/custom/j-lever')
export default {
  props: {
 
  },
  data () {
    return {
     
    }
  },
  computed: {
   
  },  
  watch: {
   
  },
  methods: {
 
  },
  created () {
  
  },
  beforeDestroy () {
  },
  components: { jLever }
}
</script>

<style lang="stylus">
$primary   ?= #027be3
$secondary ?= #26A69A
$tertiary  ?= #555
$color ?= $primary
$positive  ?= #21BA45
$negative  ?= #DB2828
$info      ?= #31CCEC
$warning   ?= #F2C037

$white     ?= #fff
$light     ?= #f4f4f4
$dark      ?= #333
$faded     ?= #777
$range-height              ?= 36px
$range-color               ?= $grey-4
$range-active-color        ?= $form-active-color

$range-track-height        ?= 2px
$range-mark-height         ?= 10px

$range-handle-size         ?= 20px
$range-handle-radius       ?= 50%



.q-range-track
  position absolute
  top 50%
  left 0
  transform translateY(-50%)
  height $range-track-height
  width 100%
  background $range-color
  &:not(.dragging)
    transition all .3s ease
  &.active-track
    background $range-active-color
  &.value-track
    background white
    height $range-track-height * 3
  &.track-draggable.dragging
    height ($range-track-height * 2)
    transition height .3s ease
  &.handle-at-minimum
    background transparent
  &.handle-at-maximum
    background solid

.q-range-mark
  position absolute
  top 50%
  height $range-mark-height
  width 2px
  background $range-color
  transform translateX(-50%) translateY(-50%)

  .q-range-value
    margin-top 14px
    font-size 10px
    margin-left -2px

.q-range-handle-container
  position relative
  height 100%
  margin-left ($range-handle-size / 2)
  margin-right ($range-handle-size / 2)

.q-range-label
  position relative
  top - $range-handle-size * .75
  left -25%
  padding 8px 0
  opacity 0
  text-align center
  transform translateY(0) scale(.1)
  transition all .3s ease
  width (1.5 * $range-handle-size)
  height (1.5 * $range-handle-size)
  font-size ($range-handle-size / 2)
  line-height ($range-handle-size / 3)
  color white
  &:before
    content ''
    z-index -1
    position absolute
    top (- $range-handle-size * .25)
    left 0
    width (1.5 * $range-handle-size)
    height (1.5 * $range-handle-size)
    background $range-active-color
    border-radius 50% 50% 50% 0
    transform rotate(-45deg)
  &.label-always
    opacity 1
    transform translateY(-50%) scale(1)

.q-range-handle.undraggable>.q-range-label
  top (- $range-handle-size - ($range-handle-size * .75))

.q-range-handle
  position absolute
  top 50%
  transform translate3d(-50%, -50%, 0) scale(.67)
  transform-origin center
  transition all .3s ease
  width $range-handle-size
  height $range-handle-size
  border-radius $range-handle-radius
  box-sizing content-box
  &.dragging
    transform translate3d(-50%, -50%, 0) scale(1)
    transition opacity .3s ease, transform .3s ease
    .q-range-label
      opacity 1
      transform translateY(-50%) scale(1)
  &:not(.undraggable)
    background $range-active-color
    &.handle-at-minimum
      background white
      border 2px solid $range-color
      .q-range-label
        color black
        &:before
          background $range-color
  &.undraggable
    background transparent
    &.handle-at-minimum
      .q-range-label
        color black
        &:before
          background $range-color
    &:before
      content ''
      display block
      width 0
      height 0
      border-top ($range-handle-size / 2) solid transparent
      border-bottom ($range-handle-size / 2) solid transparent

.q-range-handle-min.undraggable:before
  border-left $range-handle-size solid $range-active-color
  margin-left ($range-handle-size * .35)
.q-range-handle-min.handle-at-minimum.undraggable:before
  border-left-color $range-color

.q-range-handle-max.undraggable:before
  border-right $range-handle-size solid $range-active-color
  margin-left ($range-handle-size * -.35)

.q-range
  height $range-height
  width 100%
  cursor pointer


  &.has-error
    .q-range-track
      background alpha($color, 50%)
    .q-range-track.active-track,
    .q-range-handle:not(.handle-at-minimum)
      background $has-error
</style>