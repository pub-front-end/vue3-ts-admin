import { PubCol, PubContainer, PubContent, PubContentItem } from './packages/container';
import render from './packages/render';
import { SimpleTable } from './packages/simple-table';
import { PubTable } from './packages/table';
const components = [PubContainer, PubContent, PubContentItem, PubCol, SimpleTable, render, PubTable];

export const initComponents = (app: any) => {
  components.forEach((component) => {
    app.use(component);
  });
};

export default {};
