import { App } from 'vue';
import PubCol from './src/col.vue';
import PubContainer from './src/container.vue';
import PubContentItem from './src/content-item.vue';
import PubContent from './src/content.vue';

PubCol.install = (app: App): void => {
  app.component(PubCol.name, PubCol);
};
PubContainer.install = (app: App): void => {
  app.component(PubContainer.name, PubContainer);
};
PubContentItem.install = (app: App): void => {
  app.component(PubContentItem.name, PubContentItem);
};
PubContent.install = (app: App): void => {
  app.component(PubContent.name, PubContent);
};
export { PubContainer, PubContent, PubContentItem, PubCol };
export default PubContainer;
