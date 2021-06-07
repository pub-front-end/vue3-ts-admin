import { PubCol, PubContainer, PubContent, PubContentItem } from './packages/container';
import render from './packages/render';
import { PubAsyncTable, PubTable } from './packages/table';

const components = [PubContainer, PubContent, PubContentItem, PubCol, PubTable, PubAsyncTable, render];

export const initComponents = (app: any) => {
  components.forEach((component) => {
    app.use(component);
  });
};

export default {};
