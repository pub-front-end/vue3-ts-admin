<template>
  <div id="tags-view-container" class="tags-view-container">
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
        ref="tag"
        :key="tag.path"
        :class="isActive(tag) ? 'active' : ''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        tag="span"
        class="tags-view-item"
        @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        <span class="title">{{ tag.title }}</span>
        <span v-if="!isAffix(tag)" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />
      </router-link>
    </scroll-pane>
    <i
      class="el-icon-d-arrow-right tags-view-button"
      :class="rightDisabled ? 'tags-view-button--disabled' : ''"
      @click="scrollToRight"
    ></i>
    <span>{{ selectedTag.title }}</span>
    <el-divider direction="vertical" style="height: 2rem"></el-divider>
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        <i class="el-icon-arrow-down tags-view-button"></i>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="now">关闭当前</el-dropdown-item>
          <el-dropdown-item command="other">关闭其他</el-dropdown-item>
          <el-dropdown-item command="all">关闭全部</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags(selectedTag)">关闭其他</li>
      <li @click="closeAllTags(selectedTag)">关闭全部</li>
    </ul>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import ScrollPane from './scroll-pane';
  import path from 'path';

  export default defineComponent({
    name: 'tags-view',
    components: { ScrollPane },
    data() {
      return {
        visible: false,
        leftDisabled: false,
        rightDisabled: false,
        top: 0,
        left: 0,
        selectedTag: {},
        affixTags: [],
        routes: []
      };
    },
    computed: {
      visitedViews() {
        return this.$store.state.tagsView.visitedViews;
      },
      scrollPaneRef() {
        return this.$refs.scrollPane;
      }
    },
    watch: {
      $route() {
        this.addTags();
        this.moveToCurrentTag();
      },
      visible(value) {
        if (value) {
          document.body.addEventListener('click', this.closeMenu);
        } else {
          document.body.removeEventListener('click', this.closeMenu);
        }
      }
    },
    mounted() {
      // this.initTags();
      this.addTags();
      this.scrollPaneRef.initScroll();
    },
    methods: {
      handleCommand(command) {
        let activatedTag = this.visitedViews.find((e) => e.path === this.$route.path);
        if (command === 'all') {
          this.closeAllTags(activatedTag);
        } else if (command === 'other') {
          this.closeOthersTags(activatedTag);
        } else {
          this.closeSelectedTag(activatedTag);
        }
      },
      updateScrollStatus({ leftDisabled, rightDisabled }) {
        if (leftDisabled !== undefined) this.leftDisabled = leftDisabled;
        if (rightDisabled !== undefined) this.rightDisabled = rightDisabled;
      },
      isActive(route) {
        return route.path === this.$route.path;
      },
      isAffix(tag) {
        return tag.meta && tag.meta.affix;
      },
      filterAffixTags(routes, basePath = '/') {
        let tags = [];
        routes.forEach((route) => {
          if (route.meta && route.meta.affix) {
            const tagPath = path.resolve(basePath, route.path);
            tags.push({
              fullPath: tagPath,
              path: tagPath,
              name: route.name,
              meta: { ...route.meta }
            });
          }
          if (route.children) {
            const tempTags = this.filterAffixTags(route.children, route.path);
            if (tempTags.length >= 1) {
              tags = [...tags, ...tempTags];
            }
          }
        });
        return tags;
      },
      initTags() {
        const affixTags = (this.affixTags = this.filterAffixTags(this.routes));
        for (const tag of affixTags) {
          // Must have tag name
          if (tag.name) {
            this.$store.dispatch('tagsView/addVisitedView', tag);
          }
        }
      },
      addTags() {
        const { name } = this.$route;
        if (name) {
          this.$store.dispatch('tagsView/addView', this.$route);
        }
        return false;
      },
      moveToCurrentTag() {
        const tags = this.$refs.tag;
        this.$nextTick(() => {
          for (const tag of tags) {
            if (tag.to.path === this.$route.path) {
              this.$refs.scrollPane.moveToTarget(tag);
              // when query is different then update
              if (tag.to.fullPath !== this.$route.fullPath) {
                this.$store.dispatch('tagsView/updateVisitedView', this.$route);
              }
              break;
            }
          }
        });
      },
      refreshSelectedTag({ fullPath }) {
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath
          });
        });
      },
      closeSelectedTag(view) {
        this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
          if (this.isActive(view)) {
            this.toLastView(visitedViews);
          }
        });
      },
      closeOthersTags(tag) {
        this.$router.push(tag);
        this.$store.dispatch('tagsView/delOthersViews', tag).then(() => {
          this.moveToCurrentTag();
        });
      },
      closeAllTags(view) {
        this.$store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
          if (this.affixTags.some((tag) => tag.path === view.path)) {
            return;
          }
          this.toLastView(visitedViews);
        });
      },
      toLastView(visitedViews) {
        const latestView = visitedViews.slice(-1)[0];
        if (latestView) {
          this.$router.push(latestView.fullPath);
        } else {
          this.$router.replace({ path: '/redirect' + '/itemManage' });
        }
      },
      openMenu(tag, e) {
        const menuMinWidth = 105;
        const offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
        const offsetWidth = this.$el.offsetWidth; // container width
        const maxLeft = offsetWidth - menuMinWidth; // left boundary
        const left = e.clientX - offsetLeft + 15; // 15: margin right

        this.left = left > maxLeft ? maxLeft : left;
        this.top = e.clientY - 90;

        this.visible = true;
        this.selectedTag = tag;
      },
      closeMenu() {
        this.visible = false;
      },
      handleScroll() {
        this.closeMenu();
      },
      scrollToLeft() {
        !this.leftDisabled && this.scrollPaneRef.moveToLeft();
      },
      scrollToRight() {
        !this.rightDisabled && this.scrollPaneRef.moveToRight();
      }
    }
  });
</script>

<style lang="scss">
  .tags-view-container {
    width: 100%;
    height: 100%;
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
    .el-icon-arrow-down:before {
      content: '\e6df';
    }
    .el-scrollbar__bar.is-horizontal {
      height: 0;
    }
    .el-scrollbar__wrap {
      overflow-y: auto;
      overflow-x: hidden;
      height: 50px !important;
    }
    .tags-view-wrapper {
      height: 100%;
      flex: 1;
      width: 0;
      .tags-view-item {
        display: inline-block;
        position: relative;
        cursor: pointer;
        height: 30px;
        line-height: 30px;
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
        color: #495060;
        background: #eff3f9;
        padding: 5px 8px;
        font-size: 12px;
        margin-top: 10px;
        margin-bottom: -1px;
        .title {
          padding: 0 8px;
        }
        &:first-of-type {
          margin-left: 15px;
        }
        &:last-of-type {
          margin-right: 15px;
        }
        &.active {
          background-color: #fff;
          color: #000;
        }
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
