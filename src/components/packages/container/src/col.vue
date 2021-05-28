<!--L.Dragon-->
<template>
  <el-col
    :offset="offset"
    :push="push"
    :pull="pull"
    :xs="sizeObj.xs"
    :sm="sizeObj.sm"
    :md="sizeObj.md"
    :lg="sizeObj.lg"
    :xl="sizeObj.xl"
  >
    <slot></slot>
  </el-col>
</template>

<script lang="ts">
  import { defineComponent, computed, PropType } from 'vue';

  import { TSize } from '../../../types/render';
  // 默认的适屏配置 基础的 24 分栏
  const adaptiveObj: {
    [key: number]: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
  } = {
    2: {
      xs: 12,
      sm: 8,
      md: 4,
      lg: 2,
      xl: 2
    },
    3: {
      xs: 12,
      sm: 8,
      md: 6,
      lg: 3,
      xl: 3
    },
    4: {
      xs: 24,
      sm: 12,
      md: 8,
      lg: 6,
      xl: 4
    },
    6: {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 6,
      xl: 6
    },
    8: {
      xs: 24,
      sm: 24,
      md: 12,
      lg: 8,
      xl: 8
    },
    12: {
      xs: 24,
      sm: 24,
      md: 12,
      lg: 12,
      xl: 12
    },
    16: {
      xs: 24,
      sm: 24,
      md: 16,
      lg: 16,
      xl: 16
    },
    24: {
      xs: 24,
      sm: 24,
      md: 24,
      lg: 24,
      xl: 24
    },
    0: {
      xs: 24,
      sm: 24,
      md: 24,
      lg: 24,
      xl: 24
    }
  };
  export default defineComponent({
    name: 'pub-col',
    props: {
      // 栅格左侧的间隔格数
      offset: {
        type: Number,
        default: 0
      },
      // 栅格向右移动格数
      push: {
        type: Number,
        default: 0
      },
      // 栅格向左移动格数
      pull: {
        type: Number,
        default: 0
      },
      // 1920下尺寸大小 最大24 基础的 24 分栏
      size: {
        type: Number as PropType<TSize>,
        default: 4
      }
    },
    setup(props) {
      return {
        sizeObj: computed(() => adaptiveObj[props.size % 24])
      };
    }
  });
</script>
<style lang="scss" scoped>
  .pub-content-vertical {
    & > .pub-content-item {
      margin: 0 0 1rem 0;
      &:last-child {
        flex-grow: 1;
        height: 0;
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
