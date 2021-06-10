<template>
  <div class="tags-view-container content-bg">
    <i
      class="el-icon-d-arrow-left tags-view-button"
      :class="leftDisabled ? 'tags-view-button--disabled' : ''"
      @click="scrollToLeft"
    ></i>
    <scroll-pane
      ref="scrollPane"
      class="tags-view-wrapper"
      @scroll="handleScroll"
      @change-scoll-status="updateScrollStatus"
    >
      <router-link
        v-for="tag in visitedViews"
        :ref="setItemRef"
        :key="tag.path"
        :class="isActive(tag) ? 'active' : ''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        tag="span"
        class="tags-view-item"
        @click.middle="closeSelectedTag(tag)"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        <span class="title">{{ tag.title }}</span>
        <span class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />
      </router-link>
    </scroll-pane>
    <i
      class="el-icon-d-arrow-right tags-view-button"
      :class="rightDisabled ? 'tags-view-button--disabled' : ''"
      @click="scrollToRight"
    ></i>
    <el-divider direction="vertical" style="height: 2rem"></el-divider>
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        <i class="el-icon-arrow-down tags-view-button"></i>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="now">关闭当前</el-dropdown-item>
          <el-dropdown-item command="refresh">刷新当前</el-dropdown-item>
          <el-dropdown-item command="other">关闭其他</el-dropdown-item>
          <el-dropdown-item command="all">关闭全部</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li @click="closeOthersTags(selectedTag)">关闭其他</li>
      <li @click="closeAllTags(selectedTag)">关闭全部</li>
    </ul>
  </div>
</template>

<script lang="ts">
  import {
    computed,
    defineComponent,
    getCurrentInstance,
    nextTick,
    onBeforeUpdate,
    onMounted,
    reactive,
    ref,
    watch
  } from 'vue';
  import ScrollPane from './scroll-pane.vue';
  import { useStore } from 'vuex';
  import { RouteLocationNormalizedLoaded, useRoute, useRouter } from 'vue-router';
  export default defineComponent({
    name: 'tags-view',
    components: { ScrollPane },
    setup() {
      let vm: any = getCurrentInstance();
      const store = useStore();
      let visible = ref(false);
      let leftDisabled = ref(false);
      let rightDisabled = ref(false);
      let top = ref(0);
      let left = ref(0);
      let selectedTag = ref({});
      let routes = ref([]);
      let tagRefs: any[] = [];
      const setItemRef = (el: any) => {
        if (el) {
          tagRefs.push(el);
        }
      };
      onBeforeUpdate(() => {
        tagRefs = [];
      });
      const visitedViews = computed((): Array<RouteLocationNormalizedLoaded> => store.getters.visitedViews);

      const route = reactive(useRoute());
      const router = useRouter();

      function closeMenu() {
        visible.value = false;
      }
      function addTags() {
        const { name } = route;
        if (name) {
          store.dispatch('addVisitedView', route);
        }
      }
      function moveToCurrentTag() {
        const tags = tagRefs;
        nextTick(() => {
          for (const tag of tags) {
            if (tag.to.path === route.path) {
              vm.refs.scrollPane.moveToTarget(tag, tags);
              // when query is different then update
              if (tag.to.fullPath !== route.fullPath) {
                store.dispatch('updateVisitedView', route);
              }
              break;
            }
          }
        });
      }
      function closeSelectedTag(view: RouteLocationNormalizedLoaded) {
        store.dispatch('delVisitedView', view).then((visitedViews: Array<RouteLocationNormalizedLoaded>) => {
          if (isActive(view)) {
            toLastView(visitedViews);
          }
        });
      }
      function closeOthersTags(view: RouteLocationNormalizedLoaded) {
        // router.push(view);
        store.dispatch('delOthersVisitedViews', view).then(() => {
          moveToCurrentTag();
        });
      }
      function closeAllTags() {
        store.dispatch('delAllVisitedViews').then((visitedViews: Array<RouteLocationNormalizedLoaded>) => {
          toLastView(visitedViews);
        });
      }
      function refreshSelectedTag({ fullPath }: any) {
        nextTick(() => {
          router.replace({
            path: '/redirect' + fullPath
          });
        });
      }
      function toLastView(visitedViews: Array<RouteLocationNormalizedLoaded>) {
        const latestView = visitedViews.slice(-1)[0];
        if (latestView) {
          router.push(latestView.fullPath);
        } else {
          router.replace({ path: '/redirect' + '/home' });
        }
      }
      function handleCommand(command: string) {
        let activatedTag = visitedViews.value.find((e: any) => e.path === route.path);
        if (!activatedTag) return;
        if (command === 'all') {
          closeAllTags();
        } else if (command === 'refresh') {
          refreshSelectedTag(activatedTag);
        } else if (command === 'other') {
          closeOthersTags(activatedTag);
        } else {
          closeSelectedTag(activatedTag);
        }
      }
      function updateScrollStatus(obj: any = {}) {
        if (obj.leftDisabled !== undefined) leftDisabled.value = obj.leftDisabled;
        if (obj.rightDisabled !== undefined) rightDisabled.value = obj.rightDisabled;
      }
      function isActive(view: RouteLocationNormalizedLoaded) {
        return view.path === route.path;
      }
      function openMenu(view: RouteLocationNormalizedLoaded, e: any) {
        const menuMinWidth = 105;
        const offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
        const offsetWidth = this.$el.offsetWidth; // container width
        const maxLeft = offsetWidth - menuMinWidth; // left boundary
        const left = e.clientX - offsetLeft + 210; // 15: margin right

        this.left = left > maxLeft ? maxLeft : left;
        this.top = e.clientY + 16;

        this.visible = true;
        this.selectedTag = view;
      }

      function handleScroll() {
        closeMenu();
      }
      function scrollToLeft() {
        !leftDisabled.value && vm.scrollPane.moveToLeft();
      }
      function scrollToRight() {
        !rightDisabled.value && vm.scrollPane.moveToRight();
      }
      watch(visible, (val) => {
        if (val) {
          document.body.addEventListener('click', closeMenu);
        } else {
          document.body.removeEventListener('click', closeMenu);
        }
      });
      watch(route, () => {
        addTags();
        moveToCurrentTag();
      });
      onMounted(() => {
        addTags();
        vm.refs.scrollPane.initScroll();
      });
      return {
        visible,
        rightDisabled,
        top,
        left,
        selectedTag,
        routes,
        leftDisabled,
        visitedViews,
        setItemRef,
        closeSelectedTag,
        closeOthersTags,
        closeAllTags,
        refreshSelectedTag,
        isActive,
        handleCommand,
        openMenu,
        closeMenu,
        handleScroll,
        scrollToLeft,
        scrollToRight,
        updateScrollStatus
      };
    }
  });
</script>

<style lang="scss">
  .tags-view-container {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;

    .tags-view-button {
      padding: 8px;
      cursor: pointer;
    }
    .tags-view-button--disabled {
      fill: gray;
      cursor: not-allowed;
      &:hover {
        fill: gray;
      }
    }
    .el-dropdown-link {
      padding-right: 8px;
    }

    .el-scrollbar__bar.is-horizontal {
      height: 0;
    }
    .el-scrollbar__wrap {
      overflow-y: auto;
      overflow-x: hidden;
      display: flex;
      align-items: center;
    }
    .tags-view-wrapper {
      flex: 1;
      width: 0;
      .tags-view-item {
        display: inline-block;
        position: relative;
        cursor: pointer;
        text-decoration: none;
        height: 20px;
        line-height: 20px;
        border-radius: 4px;
        padding: 3px 8px;
        font-size: 12px;
        margin-left: 8px;
        .title {
          padding: 0 8px;
        }

        &:last-of-type {
          margin-right: 16px;
        }
      }
    }
    .contextmenu {
      margin: 0;
      z-index: 3000;
      position: absolute;
      list-style-type: none;
      padding: 0.3125rem 0;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      font-weight: 400;
      text-align: left;
      li {
        margin: 0;
        padding: 0.5rem 1rem;
        cursor: pointer;
      }
    }
  }

  .tags-view-wrapper {
    .tags-view-item {
      .el-icon-close {
        width: 16px;
        height: 16px;
        vertical-align: 2px;
        border-radius: 50%;
        text-align: center;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        transform-origin: 100% 50%;
        &:before {
          transform: scale(1.2);
          display: inline-block;
          vertical-align: -3px;
        }
        &:hover {
          background-color: #b4bccc;
          color: #fff;
        }
      }
    }
  }
</style>
