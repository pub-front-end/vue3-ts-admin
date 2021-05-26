import { createStore } from 'vuex';
import getters from './getters';
import system from './modules/system';
import tagsView from './modules/tags-view';

export default createStore({
  getters,
  modules: {
    system,
    tagsView
  }
});
