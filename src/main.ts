import '@/assets/fonts/iconfont.css';
import '@/assets/styles/theme/dark-night/index.scss'; // 暗夜模式样式
import '@/assets/styles/theme/white-day/index.scss'; // 白昼模式样式
import '@yzfe/svgicon/lib/svgicon.css';
import { VueSvgIconPlugin } from '@yzfe/vue3-svgicon';
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import 'normalize.css';
import { createApp } from 'vue';
import { usI18n } from '../src/lang';
import App from './app.vue';
import { initComponents } from './components';
import waves from './directives/waves';
import router from './router';
import store from './store';

const app = createApp(App);
app.directive('waves', waves);
initComponents(app); //初始化自定义的组件
app.use(store).use(router).use(usI18n);
app.use(ElementPlus, { size: 'small', zIndex: 3000 });

app.use(VueSvgIconPlugin, { tagName: 'svg-icon', defaultWidth: '1rem', defaultHeight: '1rem' });
app.mount('#app');
