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

<script>
  import screenfull from 'screenfull';
  const sf = screenfull;

  export default {
    name: 'screenfull',
    data() {
      return {
        isFullscreen: false
      };
    },

    mounted() {
      sf.enabled && sf.on('change', this.change);
      window.addEventListener('keydown', this.keyDown, true); //监听按键事件
    },

    beforeDestory() {
      sf.enabled && sf.off('change', this.change);
    },
    methods: {
      change() {
        if (sf.enabled) {
          this.isFullscreen = sf.isFullscreen;
        }
      },
      keyDown(event) {
        if (event.keyCode === 122) {
          event.returnValue = false;
          this.toFullscreen();
        }
      },
      toFullscreen() {
        if (!sf.enabled) {
          this.$message({
            message: '当前浏览器不支持全屏功能',
            type: 'warning'
          });
          return false;
        }
        sf.toggle();
      }
    }
  };
</script>
