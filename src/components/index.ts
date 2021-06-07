import { PubCol, PubContainer, PubContent, PubContentItem } from './packages/container';
import render from './packages/render';
import { SimpleAsyncTable, SimpleTable } from './packages/simple-table';
const components = [PubContainer, PubContent, PubContentItem, PubCol, SimpleTable, SimpleAsyncTable, render];

export const initComponents = (app: any) => {
  components.forEach((component) => {
    app.use(component);
  });
};

export default {};
