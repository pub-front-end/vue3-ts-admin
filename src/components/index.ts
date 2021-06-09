import { PubCol, PubContainer, PubContent, PubContentItem } from './packages/container';
import { PubRenderButton, PubRenderEditor, PubRenderSearch } from './packages/render/index';
import { PubAsyncTable, PubTable } from './packages/table';

const components = [
  PubContainer,
  PubContent,
  PubContentItem,
  PubCol,
  PubTable,
  PubAsyncTable,
  PubRenderSearch,
  PubRenderButton,
  PubRenderEditor
];

export const initComponents = (app: any) => {
  components.forEach((component) => {
    app.use(component);
  });
};

export default {};
