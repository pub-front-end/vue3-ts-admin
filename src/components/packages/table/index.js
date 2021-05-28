import PubAsyncTable from './src/pub-async-table';
import PubCustomTable from './src/pub-custom-table';
import PubTable from './src/pub-table';

PubTable.install = (app) => {
  app.component(PubTable.name, PubTable);
};
PubAsyncTable.install = (app) => {
  app.component(PubAsyncTable.name, PubAsyncTable);
};
PubCustomTable.install = (app) => {
  app.component(PubCustomTable.name, PubCustomTable);
};

const install = function (app) {
  PubTable.install(app);
  PubAsyncTable.install(app);
  PubCustomTable.install(app);
};

export { install, PubTable, PubAsyncTable, PubCustomTable };

export default {
  install,
  PubTable,
  PubAsyncTable,
  PubCustomTable
};
