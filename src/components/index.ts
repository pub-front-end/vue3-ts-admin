import { PubCol, PubContainer, PubContent, PubContentItem } from './packages/container';
import { PubRenderSearch } from './packages/render/index';
import { PubAsyncTable, PubTable } from './packages/table';

const components = [PubContainer, PubContent, PubContentItem, PubCol, PubTable, PubAsyncTable, PubRenderSearch];

export const initComponents = (app: any) => {
  components.forEach((component) => {
    app.use(component);
  });
};

export default {};
