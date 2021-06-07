import { App } from 'vue';
// import PubRenderButton from './src/button.vue';
// import PubRenderDetail from './src/detail.vue';
// import PubRenderEditor from './src/editor.vue';
import PubRenderSearch from './src/search.vue';

PubRenderSearch.install = (app: App) => {
  app.component(PubRenderSearch.name, PubRenderSearch);
};
// (PubRenderDetail as any).install = function (app: App) {
//   app.component(PubRenderDetail.name, PubRenderDetail);
// };
// (PubRenderEditor as any).install = function (app: App) {
//   app.component(PubRenderEditor.name, PubRenderEditor);
// };

// (PubRenderButton as any).install = function (app: App) {
//   app.component(PubRenderButton.name, PubRenderButton);
// };
export { PubRenderSearch };
export default { PubRenderSearch };
