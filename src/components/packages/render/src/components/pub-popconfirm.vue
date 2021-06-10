<template>
  <el-popover v-model:visible="visible" trigger="click">
    <div class="el-popconfirm">
      <p class="el-popconfirm__main">
        <i v-if="!hideIcon" :class="icon" class="el-popconfirm__icon" :style="{ color: iconColor }"></i>
        {{ title }}
      </p>
      <div v-if="reconfirm" style="text-align: center">
        <el-checkbox v-model="checked">{{ reconfirmLabel }}</el-checkbox>
      </div>
      <slot></slot>

      <div class="el-popconfirm__action">
        <el-button size="mini" :type="confirmButtonType" :disabled="!checked && reconfirm" @click="confirm">
          {{ confirmButtonText }}
        </el-button>
        <el-button size="mini" :type="cancelButtonType" @click="cancel">
          {{ cancelButtonText }}
        </el-button>
      </div>
    </div>
    <template #reference>
      <div>
        <el-tooltip effect="dark" :content="name" placement="top" :disabled="!typeIcon">
          <div class="pub-button-tip">
            <el-button v-waves :type="type || 'primary'" :icon="typeIcon">{{ !typeIcon ? item.name : '' }}</el-button>
          </div>
        </el-tooltip>
      </div>
    </template>
  </el-popover>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  export default defineComponent({
    name: 'pub-popconfirm',
    props: {
      title: {
        type: String,
        default: ''
      },
      name: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: ''
      },
      typeIcon: {
        type: String,
        default: ''
      },
      confirmButtonText: {
        type: String,
        default: '确定'
      },
      cancelButtonText: {
        type: String,
        default: '取消'
      },
      confirmButtonType: {
        type: String,
        default: 'primary'
      },
      cancelButtonType: {
        type: String,
        default: 'text'
      },
      icon: {
        type: String,
        default: 'el-icon-warning-outline'
      },
      //图标颜色
      iconColor: {
        type: String,
        default: '#f90'
      },
      // 是否隐藏图标
      reconfirmLabel: {
        type: String,
        default: '同意删除'
      },
      // 是否显示三次确认
      hideIcon: {
        type: Boolean,
        default: false
      },
      // 三次确认文本提示
      reconfirm: {
        type: Boolean,
        default: false
      }
    },
    emits: ['confirm', 'cancel'],
    setup(props, { emit }) {
      let visible = ref(false);
      let checked = ref(false);
      function confirm() {
        this.visible = false;
        emit('confirm');
      }
      function cancel() {
        this.visible = false;
        emit('cancel');
      }
      return { checked, visible, confirm, cancel };
    }
  });
</script>
