import enLocale from 'element-plus/lib/locale/lang/en';

const localeFiles = require.context('./modules', true, /\.ts$/);

const locale = localeFiles.keys().reduce((modules, modulePath) => {
  let value = localeFiles(modulePath);
  return value.default ? Object.assign(modules, value.default) : modules;
}, {});

// 英语国际化配置
export default {
  el: enLocale.el,
  ...locale
};
