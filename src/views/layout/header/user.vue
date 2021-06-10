<!--L.Dragon-->
<template>
  <div>
    <el-popover v-model:visible="userVisible" placement="top-end" :width="150">
      <div class="user-content">
        <div class="user-info">
          <div class="user-info--avatar">
            <svg-icon data="@svg/user-header.svg" style="width: 3rem; height: 3rem" original />
            <span class="text--normal">
              {{ user.name ? user.name : user.account }}
            </span>
          </div>
        </div>
        <div class="user-content-item" @click="turnToSetting">
          <i class="iconfont icon-user-config"></i>
          {{ $t('navbar.personelSetting') }}
        </div>
        <div class="user-content-item" @click="turnToSystemSetting">
          <i class="iconfont icon-systemManage"></i>
          {{ $t('navbar.systemSetting') }}
        </div>
        <div class="user-content-item" @click="showPassWord">
          <i class="iconfont icon-lock"></i>
          {{ $t('navbar.changePassword') }}
          <el-tooltip
            v-if="user.passwordExpireMsg"
            class="item"
            content="您的密码即将过期，请重置密码"
            placement="top"
            :open-delay="500"
          >
            <i class="iconfont el-icon-warning-outline place"></i>
          </el-tooltip>
        </div>
        <div class="user-content-item" @click="logout">
          <i class="iconfont icon-exit"></i>
          {{ $t('navbar.logout') }}
        </div>
      </div>

      <template #reference>
        <div class="navbar-user padding">
          <el-tooltip class="item" :content="$t('navbar.user')" placement="top" :open-delay="1000">
            <span>
              <el-badge v-if="user.passwordExpireMsg" is-dot class="badgeItem">
                <i class="iconfont icon-user"></i>
              </el-badge>
              <i v-else class="iconfont icon-user"></i>
              <span class="user-name">
                {{ user.name ? user.name : user.account }}
              </span>
            </span>
          </el-tooltip>
        </div>
      </template>
    </el-popover>

    <el-dialog v-model="systemDialogVisible" title="界面设置" width="25%">
      <el-row>
        <el-col :span="10" class="sys-lable">面包屑</el-col>
        <el-col :span="14" class="sys-value">
          <el-switch v-model="isShowBreadcrumb" :width="40" active-text="开启" inactive-text="不开启"></el-switch>
        </el-col>
        <el-col :span="10" class="sys-lable">标签页</el-col>
        <el-col :span="14" class="sys-value">
          <el-switch v-model="isShowTagsView" :width="40" active-text="开启" inactive-text="不开启"></el-switch>
        </el-col>
        <el-col :span="10" class="sys-lable">默认左侧菜单</el-col>
        <el-col :span="14" class="sys-value">
          <el-switch v-model="isShowMenu" :width="40" active-text="开启" inactive-text="不开启"></el-switch>
        </el-col>
      </el-row>

      <template #footer>
        <span class="dialog-footer">
          <el-button v-waves @click="systemDialogVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  // import { updatePassword } from '@/api/common/login';
  // import { TagsViewStore } from '@/store/modules/public/tags-view';
  import { useStore } from 'vuex';

  export default defineComponent({
    name: 'header-user',
    setup() {
      const store = useStore();
      const route = useRoute();
      const router = useRouter();
      let systemDialogVisible = ref(false);
      let userVisible = ref(false);
      let isShowResetPwd = ref(false);
      const turnToSetting = () => {
        userVisible.value = false;
        router.push({ path: '/settings' });
      };
      const showPassWord = () => {
        userVisible.value = false;
        isShowResetPwd.value = true;
      };
      const turnToSystemSetting = () => {
        systemDialogVisible.value = true;
      };

      const logout = () => {
        userVisible.value = false;
      };
      return {
        turnToSetting,
        showPassWord,
        systemDialogVisible,
        turnToSystemSetting,
        logout,
        userVisible,
        isShowResetPwd,
        user: computed(() => store.getters.userData),
        isShowTagsView: computed({
          get() {
            return store.getters.isShowTagsView;
          },
          set(bool) {
            if (bool) {
              store.dispatch('addView', route);
            } else {
              store.dispatch('delAllViews');
            }
            store.commit('setIsShowTagsView', bool);
          }
        }),
        isShowBreadcrumb: computed({
          get() {
            return store.getters.isShowBreadcrumb;
          },
          set(bool) {
            store.commit('setIsShowBreadcrumb', bool);
          }
        }),
        isShowMenu: computed({
          get() {
            return store.getters.isShowMenu;
          },
          set(bool) {
            store.commit('setIsShowMenu', bool);
          }
        })
      };
    }
  });
</script>
<style lang="scss" scoped>
  .twinkle {
    color: #606266;
    animation: twinkleAction 1s forwards infinite linear;
  }
  .place {
    position: absolute;
    right: 0;
    top: 0.5rem;
  }
  .sys-lable {
    text-align: right;
    padding-right: 1rem;
    margin: 1rem 0;
  }
  .sys-value {
    text-align: left;
    margin: 1rem 0;
  }
  .user-content {
    padding: 0.5rem;
    text-align: center;
    &-item {
      height: 2rem;
      line-height: 2rem;
      cursor: pointer;
      position: relative;
    }

    .user-info {
      &--avatar {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        padding: 1rem;
      }
      &--role {
        text-align: center;
        display: flex;
        justify-content: center;
        flex-direction: row;
        align-items: center;
        margin-bottom: 1rem;
        .circle {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 2rem;
          height: 2rem;
          border-radius: 2rem;
          border: 1px solid white;
          margin: 0.5rem 1rem;
        }
      }
      &--time {
        // border: 1px solid gray;
        // background: hotpink;
        padding: 0.5rem 1rem;
        margin-bottom: 1rem;
        .time-gap {
          margin-top: 0.5rem;
        }
      }
    }
  }
  .navbar-user {
    display: flex;
    align-items: center;
    cursor: pointer;
    .user-name {
      display: inline-grid;
      padding-left: 0.5rem;
      max-width: 5rem;
      //text-overflow: ellipsis;
      // font-size: 14px;
      font-size: 0.875rem;
      overflow: hidden;
      white-space: nowrap;
    }
    .el-tooltip {
      display: flex;
    }
  }
  .padding {
    padding: 0.5rem 0.8rem;
  }
  .badgeItem {
    .is-dot {
      margin-top: 10px;
      margin-left: -3px;
    }
  }
</style>
