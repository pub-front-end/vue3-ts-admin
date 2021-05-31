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
  pageId: { type: String, default: '' }, //每个表格独有的名称 用于保存表格列到数据库
  title: { type: String, default: '' }, // 列表标题
  tableCard: { type: Boolean, default: true },
  layout: { type: String, default: 'tool, table, pagination' }, // table 布局顺序
  // table 数据
  data: {
    type: Array,
    default() {
      return [];
    }
  },
  currentPage: { type: Number, default: 1 }, // 当前 页
  pageSize: { type: Number, default: 15 }, // 一页显示数目
  // 分页工具参数 会传给el-pagination
  paginationProps: {
    type: Object,
    default() {
      return {};
    }
  },
  loading: {
    type: Boolean,
    default: false
  },
  // 列数据渲染 数组
  columns: {
    type: Array,
    default: () => []
  },
  // 是否显示列表筛选popover
  showColumnFilter: { type: Boolean, default: true },
  // 是否显示table 边框
  border: { type: Boolean, default: true },
  // 是否显示 可以拖拽table行
  showSortTable: { type: Boolean, default: false },
  // 是否高亮当前选中行
  highlightCurrentRow: { type: Boolean, default: true },
  // el-table自带 斑马纹
  stripe: { type: Boolean, default: true },
  // el-table自带 高度（固定高度，超长出现内部滚动条）
  height: { type: [String, Number], default: '100%' },
  width: { type: [String, Number, undefined], default: undefined },
  rowKey: { type: String, default: 'id' }, //行数据的 Key，在使用 reserve-selection 功能与显示树形数据时，需要
  batchBtn: { type: Boolean, default: false }, //是否显示批量操作按钮，layout不包含pagination才起作用
  showType: { type: String, default: '' }, //展示类型   html：用于全文检索
  cellClassName: {
    type: Function,
    default: (className: any) => {
      return className;
    }
  }, // 单元格添加颜色
  headerCellClassName: {
    type: Function,
    default: (className: any) => {
      return className;
    }
  }, // 表头添加颜色
  rowClassName: {
    type: Function,
    default: (className: any) => {
      return className;
    }
  }
};
