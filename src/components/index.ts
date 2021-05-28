import { PubCol, PubContainer, PubContent, PubContentItem } from './packages/container';

const components = [PubContainer, PubContent, PubContentItem, PubCol];

export const initComponents = (app: any) => {
  components.forEach((component) => {
    app.use(component);
  });
};
