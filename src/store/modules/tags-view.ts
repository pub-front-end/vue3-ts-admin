import { RouteLocationNormalizedLoaded } from 'vue-router';
interface stateInter {
  visitedViews: Array<RouteLocationNormalizedLoaded>;
}
const state: stateInter = {
  visitedViews: []
};

const mutations = {
  ADD_VISITED_VIEW: (state: stateInter, view: RouteLocationNormalizedLoaded) => {
    if (state.visitedViews.some((v) => v.path === view.path)) return;
    state.visitedViews.push(
      Object.assign({}, view, {
        title: view.meta?.title || 'no-name'
      })
    );
  },

  DEL_VISITED_VIEW: (state: stateInter, view: RouteLocationNormalizedLoaded) => {
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.path === view.path) {
        state.visitedViews.splice(i, 1);
        break;
      }
    }
  },

  DEL_OTHERS_VISITED_VIEWS: (state: stateInter, view: RouteLocationNormalizedLoaded) => {
    state.visitedViews = state.visitedViews.filter((v) => {
      return v.meta.affix || v.path === view.path;
    });
  },

  DEL_ALL_VISITED_VIEWS: (state: stateInter) => {
    // keep affix tags
    const affixTags = state.visitedViews.filter((tag) => tag.meta.affix);
    state.visitedViews = affixTags;
  },

  UPDATE_VISITED_VIEW: (state: stateInter, view: RouteLocationNormalizedLoaded) => {
    for (let v of state.visitedViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view);
        break;
      }
    }
  }
};

const actions = {
  addVisitedView({ commit }: any, view: RouteLocationNormalizedLoaded) {
    commit('ADD_VISITED_VIEW', view);
  },
  delVisitedView({ commit, state }: any, view: RouteLocationNormalizedLoaded) {
    return new Promise((resolve) => {
      commit('DEL_VISITED_VIEW', view);
      resolve([...state.visitedViews]);
    });
  },

  delOthersVisitedViews({ commit, state }: any, view: RouteLocationNormalizedLoaded) {
    return new Promise((resolve) => {
      commit('DEL_OTHERS_VISITED_VIEWS', view);
      resolve([...state.visitedViews]);
    });
  },

  delAllVisitedViews({ commit, state }: any) {
    return new Promise((resolve) => {
      commit('DEL_ALL_VISITED_VIEWS');
      resolve([...state.visitedViews]);
    });
  },

  updateVisitedView({ commit }: any, view: RouteLocationNormalizedLoaded) {
    commit('UPDATE_VISITED_VIEW', view);
  }
};

export default {
  state,
  mutations,
  actions
};
