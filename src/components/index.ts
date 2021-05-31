import { PubCol, PubContainer, PubContent, PubContentItem } from './packages/container';
import { PubAsyncTable, PubCustomTable, PubTable } from './packages/table-old';
const components = [PubContainer, PubContent, PubContentItem, PubCol, PubTable, PubAsyncTable, PubCustomTable];

export const initComponents = (app: any) => {
  components.forEach((component) => {
    app.use(component);
  });
};

export default {};
