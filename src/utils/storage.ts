// 获取主题名称
const theme = 'theme-type';
export const getLocalTheme = (): string => window.localStorage.getItem(theme) || 'dark-night';
export const setLocalTheme = (content: string): void => window.localStorage.setItem(theme, content);
// 获取国际化语言
const lang = 'lang';
export const getLocalLang = (): string => window.localStorage.getItem(lang) || 'zh';
export const setLocalLang = (content: string): void => window.localStorage.setItem(lang, content);

// 是否显示面包屑
const isShowBreadcrumb = 'isShowBreadcrumb';
export const getIsShowBreadcrumb = (): string => window.localStorage.getItem(isShowBreadcrumb) || 'true';
export const setIsShowBreadcrumb = (content: string): void => window.localStorage.setItem(isShowBreadcrumb, content);
// 是否显示标签页
const isShowTagsView = 'isShowTagsView';
export const getIsShowTagsView = (): string => window.localStorage.getItem(isShowTagsView) || 'true';
export const setIsShowTagsView = (content: string): void => window.localStorage.setItem(isShowTagsView, content);

// 进入系统菜单是否展开
const isShowMenu = 'isShowMenu';
export const getIsShowMenu = (): string => window.localStorage.getItem(isShowMenu) || 'true';
export const setIsShowMenu = (content: string): void => window.localStorage.setItem(isShowMenu, content);

// 设置token信息
export const setToken = (token: string): void => window.sessionStorage.setItem('token', token);
export const getToken = (): string => window.sessionStorage.getItem('token') || '';
export const removeToken = (): void => window.sessionStorage.removeItem('token');
