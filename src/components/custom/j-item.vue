
<template>
  <!-- item is just "Bitmap" at the moment... make generic later -->
  <div class='frame' @click="onClick($event)">
    <j-canvas ref="jCanvas" :width='256' :height='256' :imageData='myImageData'></j-canvas>
    <!-- <j-canvas ref="jCanvas" :width='256' :height='256' :imageData='myImageData'></j-canvas>-->
    <!--   <j-debug :value="value.imageData"></j-debug> -->
    <label>Type: <input type="text" v-model="value._type" /></label>
    <label>Title: <input type="text" v-model="value.title" /></label> 
  </div>
</template>

<script>
  /* eslint-disable */

  export default {
    name: 'j-item',
    props: {
      value: {
        type: Object  // 'moe.objects.bitmap' (so far)
      }
    },
    data () {
      return {
      }
    },
    computed: {
      myImageData () {
        return this.value ? this.value.imageData : null
      }
    },
    methods: {
      onClick (e) {
        this.$emit('click', this.value)
      }
    }
  }
</script>

<style lang="stylus">
  // canvas {width:120px; height:120px;}
  // input {color: white;}
</style>
