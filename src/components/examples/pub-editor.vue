<template>
  <el-dialog :model-value="modelValue" :title="title" @close="cancel">
    <!-- <el-form :model="form">
      <el-form-item label="活动名称">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="活动区域">
        <el-select v-model="form.region" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
    </el-form> -->
    <pub-render-editor
      ref="editor"
      :items="items"
      :form="form"
      :type="type"
      :size="12"
      :loading="loading"
      @submit="handleSubmit"
      @cancel="cancel"
    ></pub-render-editor>
  </el-dialog>
</template>

<script lang="ts">
  import { computed, defineComponent, ref, reactive, getCurrentInstance } from 'vue';
  import { lengthRange, max } from '@/utils/validate';
  import { ElMessage } from 'element-plus';
  export default defineComponent({
    name: 'test',
    props: {
      modelValue: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: '标题'
      },
      type: {
        type: String,
        default: '标题'
      }
    },
    emits: ['update:modelValue', 'search'],
    setup(props, { emit }) {
      const vm: any = getCurrentInstance();
      const form = reactive({
        name: '',
        email: '',
        firm: '',
        phone: '',
        department: ''
      });
      let loading = ref(false);
      const items = computed(() => {
        // eslint-disable-next-line no-undef
        const temp: Pub.RenderItem[] = [
          { prop: 'name', label: '姓名', type: 'input', rules: ['required', 'text', lengthRange(2, 16)] },

          { prop: 'email', label: '邮箱', type: 'input', rules: ['email', max(32)] },
          { prop: 'phone', label: '电话号码', rules: ['phone'] },
          { prop: 'firm', label: '公司名称', rules: ['text', max(32)] },
          { prop: 'department', label: '部门名称', type: 'input', rules: ['text', max(32)] }
        ];
        return temp;
      });
      function cancel() {
        clear();
        emit('update:modelValue', false);
      }
      function handleSubmit() {
        ElMessage.success('新建成功');
        clear();
        emit('search');
        emit('update:modelValue', false);
      }
      function clear() {
        vm.refs.editor.resetFields();
      }
      return { form, items, loading, cancel, handleSubmit, clear };
    }
  });
</script>
