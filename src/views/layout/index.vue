<template>
  <div class="layout-container full-screen">
    <div class="layout-container__header">
      <div class="layout-container__header--title">
        <img src="@/assets/images/logo.png" />
      </div>
      <div class="navbar-menu"></div>
      <navbar class="layout-container__header--navbar" />
    </div>
    <div class="layout-container__body body-bg">
      <el-scrollbar
        wrap-class="layout-container__body__aside left-menu__container left-menu"
        :class="isCollapse ? 'layout-container__body__aside--none' : 'layout-container__body__aside--show'"
      >
        <pub-menu></pub-menu>
      </el-scrollbar>
      <div class="layout-container__body__main">
        <svg-icon
          v-show="!isCollapse"
          data="@svg/menu-in.svg"
          class="menu-fill menu-img"
          style="width: 0.75rem; height: 5.5rem"
          original
          @click="changeCollapse"
        />

        <svg-icon
          v-show="isCollapse"
          data="@svg/menu-out.svg"
          class="menu-fill menu-img"
          style="width: 0.75rem; height: 5.5rem"
          original
          @click="changeCollapse"
        />

        <!-- <pub-breadcrumb v-show="isShowBreadcrumb" /> -->
        <!-- <tags-view v-show="isShowTagsView" /> -->

        <div class="layout-container__body__main__center">
          <!-- <transition name="fade-transform" mode="out-in">
            <keep-alive>
              <router-view />
            </keep-alive>
          </transition> -->
          <router-view v-slot="{ Component, route }">
            <transition :name="route.meta.transition || 'fade-transform'" mode="out-in">
              <keep-alive>
                <component :is="Component" :key="route.path" />
              </keep-alive>
            </transition>
          </router-view>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, computed, ref } from 'vue';
  import { getIsShowMenu } from '@/utils/storage';
  import { useRoute } from 'vue-router';
  import { useStore } from 'vuex';
  import { emitter } from '@/utils/emitter';

  import PubMenu from './menu/menu.vue';
  import Navbar from './header/navbar.vue';
  // import TagsView from './tags-view/index.vue';
  export default defineComponent({
    name: 'layout',
    components: {
      PubMenu,
      Navbar
      // TagsView
    },
    setup() {
      const store = useStore();
      const route = useRoute();
      let isCollapse = ref(getIsShowMenu() !== 'true');
      const resize = () => {
        emitter.emit('visible.window.resize'); //可视区域大小变换
      };
      const changeCollapse = () => {
        isCollapse.value = !isCollapse.value;
        resize();
      };
      return {
        isCollapse,
        resize,
        changeCollapse,
        routePath: computed(() => route.path),
        isShowBreadcrumb: computed(() => store.getters.isShowBreadcrumb),
        isShowTagsView: computed(() => store.getters.isShowTagsView),
        isProMode: process.env.NODE_ENV === 'production' //是否是发布模式
      };
    }
  });
</script>

<style lang="scss" scoped>
  .layout-container {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    &__header {
      height: 60px;
      width: 100%;
      display: flex;
      flex-direction: row;
      background-color: black;
      &--title {
        width: 12rem;
        display: flex;
        align-items: center;
        padding-left: 1rem;
        user-select: none;
        img {
          height: 80%;
          width: auto;
        }
      }
      .navbar-menu {
        flex: 1;
        width: 0;
        overflow: hidden;
      }
      &--navbar {
        width: 22rem;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
      }
    }
    &__body {
      flex-grow: 1;
      height: 0;
      min-height: 0;
      width: 100%;
      display: flex;
      flex-direction: row;
      &__aside {
        max-height: 100%;
      }
      &__aside--show {
        // width: 12.5rem;
        overflow: hidden !important;
        flex: 0 0 12.5rem;
        ::-webkit-scrollbar {
          display: none;
        }
      }
      &__aside--none {
        // width: auto;
        flex: 0 0 0;
      }

      &__main {
        flex-grow: 1;
        width: 0;
        height: 100%;
        display: flex;
        flex-direction: column;
        &__center {
          flex-grow: 1;
          height: 0;
          min-height: 0;
        }
        &_footer {
          font-size: 12px;
          height: 30px;
          line-height: 30px;
        }
      }
      .el-menu {
        border-right: 0;
      }
    }

    .menu-img {
      position: absolute;
      top: 40%;
      cursor: pointer;
      z-index: 999;
    }
  }
</style>
