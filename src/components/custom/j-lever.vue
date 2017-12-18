  <template>
  <div
    class="q-range non-selectable"
    :class="{disabled: disable}"
    @mousedown.prevent="__setActive"
    @touchstart.prevent="__setActive"
    @touchend.prevent="__end"
    @touchmove.prevent="__update"
  > 
  <div>
    <div ref="handle" class="q-range-handle-container">
      <div class="q-range-track"></div>
      <div 
        v-if="markers"
        class="q-range-mark"
        v-for="n in myRange"
        :key="n"
        :style="{left: n.percent * 100 + '%'}">
        <div class="q-range-value">
          {{ n.value  }}
        </div>  
      </div>
      <div
        class="q-range-track active-track"
        :style="style_ActiveTrack"
        :class="{'no-transition': dragging, 'handle-at-minimum': value === min}"
      ></div>
      <!--div
        class="q-range-track value-track"
        :style="style_ValueTrack"
        :class="{'no-transition': dragging, 'handle-at-minimum': value === min}"
      ></div-->      
      <div
        class="q-range-handle"
        :style="{left: dragPercent * 100 +'%'}"
        :class="{dragging: dragging, 'handle-at-minimum': value === min}"
      >
        <div
          class="q-range-label"
          :class="{'label-always': labelAlways}"
          v-if="label || labelAlways"
        >{{ dragPercent }}</div>
      </div>
    </div>
   
  </div>
</div>
</template>



<script>
/* eslint-disable */
// import Utils from '../../utils'
import { Utils } from 'quasar'
import { Platform } from 'quasar'
const TWEEN = require('es6-tween')

// const { Tween, Easing, Interpolation, autoPlay } = require('es6-tween');
//import { Easing, Interpolation, Tween, autoPlay } from 'es6-tween';

export default {
  props: {
    value: {
      type: Number,
      required: true
    },
    rest: String,
    range: {
      // range of segments
      type: Object
    },
    step: {
      type: Number,
      default: 1
    },
    snap: Boolean,
    markers: Boolean,
    label: Boolean,
    labelAlways: Boolean,
    disable: Boolean
  },
  data () {
    return {
      number: 0,
      animatedNumber: 0,   
      dragging: false,
      min: 0,
      max: 10,
      currentSegmentMin: { percent: 1, value: null },
      currentSegmentMax: { percent: 0, value: null },
      myRange: null,
      myRestPercent: parseInt(this.rest,10)/100,
      dragPercent: 0,
      segmentPercent: 0,
      myValue: null      
    }
  },
  computed: {
    style_ActiveTrack () {
      let 
        rest = parseInt(this.rest),
        drag = this.dragPercent * 100
      return {
        left: Math.min( rest, drag ) + '%',
        width: Math.abs( rest - drag ) + '%'
      }
    },
    style_ValueTrack () {
      let 
        rest = parseInt(this.rest),
        drag = this.valuePercent * 100
      return {
        left: Math.min( rest, drag ) + '%',
        width: Math.abs( rest - drag ) + '%'
      }
    },    
    myRange () {
      // Array of range segments: percentages for each value waypoint
      // Prop in: {'min': 0, '20%': 99, 'max': 250}
      // myRange: [{percent: 0, value: 0}, {percent: 0.2, value: 99}, {percent: 1, value: 250}]
      let range = Object.keys(this.range).map(v => {
        if (v === 'min') {
          this.min = this.range[v]
          return { percent: 0, value: this.min }
        } 
        else if (v === 'max') {
          this.max = this.range[v]
          return { percent: 1, value: this.max }
        } 
        else { 
          return { percent: parseInt(v) / 100, value: this.range[v] }
        }
      })
      return range
    }
    // ,
    // currentPercent () {
    //   if (this.snap) {
    //     return (this.value - this.min) / (this.max - this.min) * 100 + '%'
    //   }
    //   return 100 * this.currentPercent + '%'
    // }
  },  
  watch: {
    dragPercent () {

    },
    myValue (newValue, oldValue) {
      var vm = this
      var animationFrame
      function animate (time) {
        TWEEN.update(time)
        animationFrame = requestAnimationFrame(animate)
      }
      
      new TWEEN.Tween({ tweeningNumber: oldValue })
        .easing(TWEEN.Easing.Quadratic.Out)
        .to({ tweeningNumber: newValue }, 5500)
        .on('update', (x) => {
          this.animatedNumber = x.tweeningNumber
        })
        .on('complete', () => {
          cancelAnimationFrame(animationFrame)  
        })
        .start()
      animationFrame = requestAnimationFrame(animate)
    },    
    min (value) {
      if (this.value < value) {
        this.value = value
        return
      }
      this.$nextTick(this.__validateProps)
    },
    max (value) {
      if (this.value > value) {
        this.value = value
        return
      }
      this.$nextTick(this.__validateProps)
    },
    step () {
      this.$nextTick(this.__validateProps)
    }
  },
  methods: {
    // smoothStep(a, b, x)
    // {
    //     if(x < 0)
    //         return 0.0f;
    //     if(x >= b)
    //         return 1.0f;
    
    //     x = (x - a)/(b - a); //normalizes x
    //     return (x*x * (3 - 2*x));
    // },
    // SmoothMove() 
    // { 
    //   let startspot, endspot
      
    //   function Start () {
    //       SmoothMove(startspot.position, endspot.position, 5.0);
    //   }
      
    //   function SmoothMove (startpos : Vector3, endpos : Vector3, seconds : float) {
    //       var t = 0.0;
    //       while (t <= 1.0) {
    //           t += Time.deltaTime/seconds;
    //           transform.position = Vector3.Lerp(startpos, endpos, this.smoothStep(0.0, 1.0, t));
    //           yield;
    //       }
    //   },
    __setActive (event) {
      if (this.disable) {
        return
      }
    
      let container = this.$refs.handle


      this.dragging = {
        left: container.getBoundingClientRect().left,
        width: container.offsetWidth
      }
      this.__update(event)
    },
    between (v, min, max) {
      return Math.min(Math.max(v, min), max)
    },

    
    __updateUsingDragPercent ( dragPercent ) {
      // dragPercent: 0...1
      // If dragPercent out of segment's percent range, set new segment & ranges
      if (dragPercent < this.currentSegmentMin.percent || dragPercent > this.currentSegmentMax.percent) {
        
        let i = this.myRange.findIndex(v => {
          return v.percent > dragPercent
        })
        console.log("change" + i)
        this.currentSegmentMin = this.myRange[i-1]
        this.currentSegmentMax = this.myRange[i]
        // this.currentSegmentPercentRange = this.currentSegmentMax.percent - this.currentSegmentMin.percent
        // this.currentSegmentValueRange = this.currentSegmentMax.value - this.currentSegmentMin.value
      }

      // Get drag percent of just this segment
      let segmentPercent = (dragPercent - this.currentSegmentMin.percent) / (this.currentSegmentMax.percent - this.currentSegmentMin.percent)
      let value = this.currentSegmentMin.value + segmentPercent * (this.currentSegmentMax.value - this.currentSegmentMin.value)

      let modulo = (value - this.currentSegmentMin.value) % this.step

      this.dragPercent = dragPercent 
      this.segmentPercent = segmentPercent
      this.myValue = value
      // this.currentPercentage = percentage
      // this.$emit('input', this.between(value - modulo + (Math.abs(modulo) >= this.step / 2 ? (modulo < 0 ? -1 : 1) * this.step : 0), this.currentSegmentMin.value, this.currentSegmentMax.value))

    },
    __updateUsingValue ( value ) {

    },
    __update (event) {
      if (!this.dragging) {
        return
      }
      // Get drag percent of entire control (0 < 1)
      this.__updateUsingDragPercent( this.between((Utils.event.position(event).left - this.dragging.left) / this.dragging.width, 0, 1) )
      this.$emit('input', this.myValue) // this.between(value, this.min, this.max))
    },
    __end () {
      this.dragging = false
      this.__updateUsingDragPercent(this.myRestPercent)
      this.currentPercentage = (this.value - this.min) / (this.max - this.min)
      this.$emit('input', this.myValue)
    },
    __validateProps () {
      if (this.min >= this.max) {
        console.error('Range error: min >= max', this.$el, this.min, this.max)
      }
      else if ((this.max - this.min) % this.step !== 0) {
        console.error('Range error: step must be a divisor of max - min', this.$el, this.min, this.max, this.step)
      }
    }
  },
  created () {
    this.__validateProps()
    if (Platform.is.desktop) {
      document.body.addEventListener('mousemove', this.__update)
      document.body.addEventListener('mouseup', this.__end)
    }
  },
  beforeDestroy () {
    if (Platform.is.dekstop) {
      document.body.removeEventListener('mousemove', this.__update)
      document.body.removeEventListener('mouseup', this.__end)
    }
  }
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