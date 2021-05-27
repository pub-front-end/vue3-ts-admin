<template>
  <div id="screenfull">
    <el-tooltip
      class="item"
      :content="$t(isFullscreen ? 'navbar.unfull' : 'navbar.full')"
      placement="top"
      :open-delay="500"
    >
      <i class="iconfont icon-color" :class="isFullscreen ? 'icon-unfull' : 'icon-full'" @click="toFullscreen"></i>
    </el-tooltip>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { ElMessage } from 'element-plus';

  import screenfull from 'screenfull';
  const sf = screenfull;
  export default defineComponent({
    name: 'screenfull',
    data() {
      return {
        isFullscreen: false
      };
    },

    mounted() {
      sf.isEnabled && sf.on('change', this.change);
      window.addEventListener('keydown', this.keyDown, true); //监听按键事件
    },

    beforeDestory() {
      sf.isEnabled && sf.off('change', this.change);
    },
    methods: {
      change() {
        if (sf.isEnabled) {
          this.isFullscreen = sf.isFullscreen;
        }
      },
      keyDown(event: any) {
        if (event.keyCode === 122) {
          event.returnValue = false;
          this.toFullscreen();
        }
      },
      toFullscreen() {
        if (!sf.isEnabled) {
          ElMessage.warning('当前浏览器不支持全屏功能');
          return false;
        }
        sf.toggle();
      }
    }
  });
</script>
