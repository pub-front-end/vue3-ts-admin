import '@/assets/fonts/iconfont.css';
import '@/assets/styles/theme/dark-night/index.scss'; // 暗夜模式样式
import '@yzfe/svgicon/lib/svgicon.css';
import { VueSvgIconPlugin } from '@yzfe/vue3-svgicon';
import ElementPlus from 'element-plus';
import { createApp } from 'vue';
import { usI18n } from '../src/lang';
import App from './app.vue';
import router from './router';
import store from './store';
import { emitter } from './utils/emitter';

const app = createApp(App);
app.config.globalProperties.$emitter = emitter; // 事件总线
app.use(store).use(router).use(usI18n);
app.use(ElementPlus, { size: 'small', zIndex: 3000 });

app.use(VueSvgIconPlugin, { tagName: 'svg-icon', defaultWidth: '1rem', defaultHeight: '1rem' });
app.mount('#app');
