const getters = {
  userData: (state: any) => state.system.userData,
  lang: (state: any) => state.system.lang,
  isShowBreadcrumb: (state: any) => state.system.isShowBreadcrumb,
  isShowTagsView: (state: any) => state.system.isShowTagsView,
  isShowMenu: (state: any) => state.system.isShowMenu
};

export default getters;
