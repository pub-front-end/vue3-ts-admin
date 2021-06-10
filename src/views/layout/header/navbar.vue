<!--L.Dragon-->
<template>
  <div class="navbar">
    <screenfull class="padding" />

    <el-dropdown trigger="click" @command="themeClick">
      <div>
        <el-tooltip :content="$t('navbar.theme')" placement="top" :open-delay="500">
          <i class="iconfont icon-theme padding icon-color"></i>
        </el-tooltip>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="dark-night">
            <i class="iconfont icon-night"></i>
            {{ $t('navbar.darkNight') }}
          </el-dropdown-item>
          <el-dropdown-item command="white-day">
            <i class="iconfont icon-day"></i>
            {{ $t('navbar.whiteDay') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <lang></lang>
    <user></user>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import screenfull from './screenfull.vue';
  import user from './user.vue';
  import lang from './lang.vue';
  import { useStore } from 'vuex';
  import { emitter } from '@/utils/emitter';
  import { getLocalTheme } from '@/utils/storage';

  export default defineComponent({
    name: 'navbar',
    components: {
      screenfull,
      user,
      lang
    },
    setup() {
      const store = useStore();
      let themes = ['dark-night', 'white-day'];
      let localTheme = getLocalTheme();
      if (!themes.includes(localTheme)) {
        localTheme = themes[0];
      }
      console.log('localTheme---', localTheme);

      themeClick(localTheme);

      function themeClick(val: string) {
        if (val === store.getters.theme) return;
        store.commit('setTheme', val);
        document.documentElement.className = val;
        emitter.emit('themeChange'); //触发主题变化
      }
      return { themeClick };
    }
  });
</script>

<style lang="scss">
  .padding {
    padding: 0.5rem 0.8rem;
  }
</style>
