<!--L.Dragon-->
<template>
  <div
    :class="direction === 'vertical' ? 'pub-content-vertical' : 'pub-content-horizontal'"
    :style="{
      padding
    }"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  type IDirection = 'vertical' | 'horizontal';
  export default defineComponent({
    name: 'pub-content',
    props: {
      // css padding元素
      padding: {
        type: String,
        default: '1rem 1rem 0 1rem'
      },
      //  内容排列方向 vertical：竖向；horizontal：横向
      direction: {
        type: String as PropType<IDirection>,
        default: 'vertical'
      }
    }
  });
</script>
<style lang="scss" scoped>
  .pub-content-vertical {
    flex-grow: 1;
    height: 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .pub-content-horizontal {
    height: 100%;
    min-width: 0;
    margin-bottom: 1rem;
    display: flex;
    flex-direction: row;
  }
</style>
