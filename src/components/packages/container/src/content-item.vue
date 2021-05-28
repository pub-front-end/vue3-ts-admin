<!--L.Dragon-->
<template>
  <div class="pub-content-item">
    <slot></slot>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  export default defineComponent({
    name: 'pub-content-item'
  });
</script>
<style lang="scss" scoped>
  .pub-content-vertical {
    & > .pub-content-item {
      margin: 0 0 1rem 0;
      &:last-child {
        flex-grow: 1;
        height: 0;
        .pub-content-item & {
          margin-bottom: 0;
        }
        .pub-card {
          margin-bottom: 0;
        }
      }
    }
  }
  .pub-content-horizontal {
    & > .pub-content-item {
      margin: 0 1rem 0 0;
      display: flex;
      flex-direction: column;
      &:last-child {
        margin-right: 0;
      }
    }
  }
</style>
