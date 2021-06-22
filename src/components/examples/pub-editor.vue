<template>
  <el-dialog :model-value="modelValue" :title="title" @close="cancel">
    <pub-render-editor
      ref="editor"
      :items="items"
      :form="operItem"
      :type="type"
      :size="12"
      :loading="loading"
      @submit="handleSubmit"
      @cancel="cancel"
    ></pub-render-editor>
  </el-dialog>
</template>

<script lang="ts">
  import { computed, defineComponent, ref, getCurrentInstance } from 'vue';
  import { lengthRange, max } from '@/utils/validate';
  import { ElMessage } from 'element-plus';
  import { useI18n } from 'vue-i18n';

  export default defineComponent({
    name: 'test',
    props: {
      modelValue: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: ''
      },
      operItem: {
        type: Object,
        default: () => {}
      }
    },
    emits: ['update:modelValue', 'search'],
    setup(props, { emit }) {
      const { t } = useI18n();
      const vm: any = getCurrentInstance();

      let loading = ref(false);
      const items = computed(() => {
        // eslint-disable-next-line no-undef
        const temp: Pub.RenderItem[] = [
          { prop: 'name', label: t('pubTable.name'), type: 'input', rules: ['required', 'text', lengthRange(2, 16)] },

          { prop: 'email', label: t('pubTable.date'), type: 'input', rules: ['email', max(32)] },
          { prop: 'phone', label: t('pubTable.region'), rules: ['phone'] },
          { prop: 'date', label: t('pubTable.regionName'), rules: ['text', max(32)] },
          { prop: 'address', label: t('pubTable.address'), type: 'input', rules: ['text', max(32)] }
        ];
        return temp;
      });
      function cancel() {
        clear();
        emit('update:modelValue', false);
      }
      function handleSubmit() {
        ElMessage.success(t('button.new') + t('info.success'));
        clear();
        emit('search');
        emit('update:modelValue', false);
      }
      function clear() {
        vm.refs.editor.resetFields();
      }

      return { items, loading, cancel, handleSubmit, clear };
    }
  });
</script>
