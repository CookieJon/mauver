<template lang="pug">
  <!-- if you want automatic padding use "layout-padding" class -->
  <div class="layout-padding"> 
    <!-- your content -->
    <input v-model.number="number" type="number" step="20">
  </div>
</template>

<script>
export default {
  data () {
    return {}
  }
}
</script>

<style>
</style>
