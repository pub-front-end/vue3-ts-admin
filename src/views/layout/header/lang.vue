<!--L.Dragon-->
<template>
  <el-dropdown trigger="click" @command="langClick">
    <div>
      <el-tooltip class="item" :content="$t('navbar.lang')" placement="top" :open-delay="1000">
        <i class="iconfont icon-zhongyingwen padding icon-color"></i>
      </el-tooltip>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="zh">
          <i class="iconfont icon-chinese"></i>
          中文
        </el-dropdown-item>
        <el-dropdown-item command="en">
          <i class="iconfont icon-english"></i>
          English
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts">
  import { ref, defineComponent, watch, unref } from 'vue';
  import { setLocalLang } from '@/utils/storage';
  import ElementLocale from 'element-plus/lib/locale';
  import enLocale from 'element-plus/lib/locale/lang/en';
  import zhLocale from 'element-plus/lib/locale/lang/zh-cn';
  import { useRoute } from 'vue-router';
  import { useI18n } from 'vue-i18n';

  const elLocaleMap: any = {
    zh: zhLocale,
    en: enLocale
  };
  export default defineComponent({
    name: 'lang',
    setup() {
      let langs = ref(true);
      const { locale, t } = useI18n();
      const route = useRoute();

      // 国际化语言切换
      const langClick = (command: string): void => {
        locale.value = command;
        ElementLocale.use(elLocaleMap[command]);
        setLocalLang(command);
      };
      watch(
        () => langs.value,
        () => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          document.title = t(unref(route.meta.title)); // 动态title
        }
      );
      return { langs, langClick };
    }
  });
</script>
<style lang="scss" scoped>
  .padding {
    padding: 0.5rem 0.8rem;
  }
</style>
