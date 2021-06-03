import { propTypes } from '@/utils/propTypes';
interface fn {
  (...args: any[]): any;
}

interface AnyObject {
  [key: string]: any;
}
export interface ItableProps {
  pageId: string; //每个表格独有的名称 用于保存表格列到数据库
  title: string; // 列表标题
  tableCard: boolean;
  layout: string; // table 布局顺序
  // table 数据
  data: Array<any>;
  currentPage: number; // 当前 页
  pageSize: number; // 一页显示数目
  // 分页工具参数 会传给el-pagination
  paginationProps: AnyObject;
  loading: boolean;
  // 列数据渲染 数组
  columns: Array<any>;
  // 是否显示列表筛选popover
  showColumnFilter: boolean;
  // 是否显示table 边框
  border: boolean;
  // 是否显示 可以拖拽table行
  showSortTable: boolean;
  // 是否高亮当前选中行
  highlightCurrentRow: boolean;
  // el-table自带 斑马纹
  stripe: boolean;
  // el-table自带 高度（固定高度，超长出现内部滚动条）
  height: [string, number];
  width: [string, number, undefined];
  rowKey: string; //行数据的 Key，在使用 reserve-selection 功能与显示树形数据时，需要
  batchBtn: boolean; //是否显示批量操作按钮，layout不包含pagination才起作用
  showType: string; //展示类型   html：用于全文检索
  cellClassName: fn; // 单元格添加颜色
  headerCellClassName: fn; // 表头添加颜色
  rowClassName: fn;
}

export default {
  pageId: propTypes.string.def(''), //每个表格独有的名称 用于保存表格列到数据库
  title: propTypes.string.def(''), // 列表标题
  tableCard: propTypes.bool.def(true),
  layout: propTypes.string.def('tool, table, pagination'), // table 布局顺序
  columns: propTypes.array.def([]), // 列数据渲染 数组
  data: propTypes.array.def([]), // table 数据
  currentPage: propTypes.number.def(1), // 当前 页
  pageSize: propTypes.number.def(15), // 一页显示数目
  paginationProps: propTypes.object.def({}), // 分页工具参数 会传给el-pagination
  loading: propTypes.bool.def(true),
  border: propTypes.bool.def(true), // 是否显示table 边框
  showSortTable: propTypes.bool.def(true), // 是否显示 可以拖拽table行
  highlightCurrentRow: propTypes.bool.def(true), // 是否高亮当前选中行
  stripe: propTypes.bool.def(true), // el-table自带 斑马纹
  showColumnFilter: propTypes.bool.def(true), // 是否显示列表筛选popover
  height: propTypes.oneOfType([String, Number]).def('100%'), // el-table自带 高度（固定高度，超长出现内部滚动条）

  width: propTypes.oneOfType([String, Number]).def(undefined),

  rowKey: propTypes.string.def('id'), //行数据的 Key，在使用 reserve-selection 功能与显示树形数据时，需要
  batchBtn: propTypes.bool.def(false), //是否显示批量操作按钮，layout不包含pagination才起作用
  showType: propTypes.string.def(''), //展示类型   html：用于全文检索
  cellClassName: propTypes.func.def((className: any) => className), // 单元格添加颜色
  headerCellClassName: propTypes.func.def((className: any) => className), // 表头添加颜色
  rowClassName: propTypes.func.def((className: any) => className)
};
