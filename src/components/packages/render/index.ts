import { App } from 'vue';
import PubRenderButton from './src/button.vue';
import PubRenderEditor from './src/editor.vue';
import PubRenderSearch from './src/search.vue';

PubRenderSearch.install = (app: App) => {
  app.component(PubRenderSearch.name, PubRenderSearch);
};

(PubRenderEditor as any).install = function (app: App) {
  app.component(PubRenderEditor.name, PubRenderEditor);
};

(PubRenderButton as any).install = function (app: App) {
  app.component(PubRenderButton.name, PubRenderButton);
};
export { PubRenderSearch, PubRenderEditor, PubRenderButton };
export default { PubRenderSearch, PubRenderEditor, PubRenderButton };
