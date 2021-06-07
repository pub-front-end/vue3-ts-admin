import { App } from 'vue';
import PubAsyncTable from './src/pub-async-table';
// import PubCustomTable from './src/pub-custom-table';
import PubTable from './src/pub-table';

PubTable.install = (app: App) => {
  app.component(PubTable.name, PubTable);
};
PubAsyncTable.install = (app: App) => {
  app.component(PubAsyncTable.name, PubAsyncTable);
};
// PubCustomTable.install = (app: App) => {
//   app.component(PubCustomTable.name, PubCustomTable);
// };

const install = function (app: App) {
  PubTable.install(app);
  PubAsyncTable.install(app);
  // PubCustomTable.install(app);
};

export { install, PubTable, PubAsyncTable };

export default {
  install,
  PubTable,
  PubAsyncTable
  // PubCustomTable
};
