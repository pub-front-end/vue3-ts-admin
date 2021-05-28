<!--L.Dragon-->
<template>
  <div class="pub-container">
    <slot></slot>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  export default defineComponent({
    name: 'pub-container'
  });
</script>
<style lang="scss" scoped>
  .pub-container {
    height: 100%;
    min-height: 0;
    position: relative;
    display: flex;
    flex-direction: column;
  }
</style>
