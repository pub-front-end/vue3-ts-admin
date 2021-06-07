import { App } from 'vue';
import SimpleAsyncTable from './src/simple-async-table';
// import PubCustomTable from './src/pub-custom-table';
import SimpleTable from './src/simple-table';

SimpleTable.install = (app: App) => {
  app.component(SimpleTable.name, SimpleTable);
};
SimpleAsyncTable.install = (app: App) => {
  app.component(SimpleAsyncTable.name, SimpleAsyncTable);
};
// PubCustomTable.install = (app: App) => {
//   app.component(PubCustomTable.name, PubCustomTable);
// };

const install = function (app: App) {
  SimpleTable.install(app);
  SimpleAsyncTable.install(app);
  // PubCustomTable.install(app);
};

export { install, SimpleTable, SimpleAsyncTable };

export default {
  install,
  SimpleTable,
  SimpleAsyncTable
  // PubCustomTable
};
