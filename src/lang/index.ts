import store from '@/store';
import { getLocalLang } from '@/utils/storage';
import { App } from 'vue';
import { createI18n } from 'vue-i18n';
import enLocale from './en/index';
import zhLocale from './zh/index';

const localesConfigs = {
  zh: {
    ...zhLocale
  },
  en: {
    ...enLocale
  }
};

// 初始化获取语言
export function getLanguage() {
  let lang = getLocalLang() || 'zh';
  store.commit('setLang', lang);
  return lang;
}

export const i18n = createI18n({
  locale: getLanguage(), // set locale
  fallbackLocale: 'en', // set fallback locale
  messages: localesConfigs
});
export function usI18n(app: App) {
  app.use(i18n);
}

export default i18n;
