import { ElMessage, ElNotification } from 'element-plus';

declare module 'vue/types/vue' {
  interface Vue {
    $message: typeof ElMessage;
    $notify: typeof ElNotification;
  }
}
