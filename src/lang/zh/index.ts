import zhLocale from 'element-plus/lib/locale/lang/zh-cn';

const localeFiles = require.context('./modules', true, /\.ts$/);

const locale = localeFiles.keys().reduce((modules, modulePath) => {
  let value = localeFiles(modulePath);
  return value.default ? Object.assign(modules, value.default) : modules;
}, {});

// 中文国际化配置
export default {
  el: zhLocale.el,
  ...locale
};
