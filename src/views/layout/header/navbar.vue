<!--L.Dragon-->
<template>
  <div class="navbar">
    <screenfull class="padding" />
    <lang></lang>
    <user></user>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import screenfull from './screenfull.vue';
  import user from './user.vue';
  import lang from './lang.vue';

  export default defineComponent({
    name: 'navbar',
    components: {
      screenfull,
      user,
      lang
    }
  });
</script>

<style lang="scss">
  .padding {
    padding: 0.5rem 0.8rem;
  }

  @keyframes twinkleAction {
    25% {
      color: #606266;
    }
    50% {
      color: #f56c6c;
    }
    75% {
      color: #f56c6c;
    }
    100% {
      color: #606266;
    }
  }
  .messageCenter_num {
    .el-badge__content {
      height: 0.875rem;
      padding: 0 0.2rem;
      line-height: 1;
      font-size: 0.75rem;
      border: none;
    }
    .el-badge__content.is-fixed {
      right: 0.875rem;
    }
  }
  .messageCenter {
    padding: 0 !important;
    .el-icon-warning {
      font-size: 0.8125rem;
    }
    .el-dropdown-menu__item {
      padding: 0.2rem 0.5rem !important;
      font-size: 0.7rem !important;
    }
    .el-dropdown-menu--small .el-dropdown-menu__item.el-dropdown-menu__item--divided {
      margin-top: 0px !important;
    }
    .el-dropdown-menu__item--divided {
      margin-top: 0px !important;
    }

    .pdRight {
      padding-right: 1rem;
    }

    .msgCenter_notice {
      font-size: 1rem !important;
    }
    .msgCenter_notice:hover {
      background: none !important;
      cursor: auto !important;
    }
    .msgCenter_item:hover {
      top: 0.25rem !important;
    }
    .msgCenter_list {
      display: flex;
      flex: 1;
      flex-direction: row;
    }
    .msgCenter_type {
      width: 5.875rem;
    }
    .msgCenter_dsc {
      width: 9.375rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .msgCenter_time {
      color: #acacac;
      width: 3.75rem;
      padding-right: 0.25rem;
      text-align: right;
    }
  }
</style>
