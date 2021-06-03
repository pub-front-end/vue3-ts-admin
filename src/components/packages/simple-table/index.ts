import { App } from 'vue';
// import PubAsyncTable from './src/pub-async-table';
// import PubCustomTable from './src/pub-custom-table';
import SimpleTable from './src/simple-table';

SimpleTable.install = (app: App) => {
  app.component(SimpleTable.name, SimpleTable);
};
// PubAsyncTable.install = (app: App) => {
//   app.component(PubAsyncTable.name, PubAsyncTable);
// };
// PubCustomTable.install = (app: App) => {
//   app.component(PubCustomTable.name, PubCustomTable);
// };

const install = function (app: App) {
  SimpleTable.install(app);
  // PubAsyncTable.install(app);
  // PubCustomTable.install(app);
};

export { install, SimpleTable };

export default {
  install,
  SimpleTable
  // PubAsyncTable,
  // PubCustomTable
};
