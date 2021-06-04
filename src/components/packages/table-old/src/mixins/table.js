import Sortable from 'sortablejs';
import '../style/index.scss';
import Render from '../utils/render';
import { delegate } from '../utils/tools';
import BatchBtn from './batch-btn';
import ColumnFilter from './column-filter';

const DefaultPaginationProps = {
  pageSizes: [15, 30, 50, 100],
  layout: '->, total, sizes, prev, pager, next, jumper'
  //sizes, prev, pager, next, jumper, ->, total, slot
};

export default {
  inheritAttrs: false, // 未被识别为props的属性，将不会出现在根元素上
  components: {
    Render
  },
  mixins: [ColumnFilter, BatchBtn],
  props: {
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
      default: (className) => {
        return className;
      }
    }, // 单元格添加颜色
    headerCellClassName: {
      type: Function,
      default: (className) => {
        return className;
      }
    }, // 表头添加颜色
    rowClassName: {
      type: Function,
      default: (className) => {
        return className;
      }
    }
  },
  data() {
    return {
      tableClientWidth: 100, //表格宽度
      innerLoading: false,
      innerCurrentPage: 1,
      innerPageSize: 10,
      innerPaginationProps: {},
      sortable: null, // 拖拽table对象
      sortableData: [],
      showDirectives: false, // 异步请求使用loading指令
      selectionList: [] // 选中数组
    };
  },
  computed: {
    pubTable() {
      return this.$refs.pubTable || {};
    },
    layouts() {
      return this.layout.split(',').map((item) => item.trim());
    },
    paginationShow() {
      return this.layouts.includes('pagination');
    },
    toolBarShow() {
      return this.layouts.includes('tool') && this.$slots.tool;
    },
    // 根据是否配置width来计算列宽，如果存在一个列没有配置width，则按照分配的来；如果所有列都分配了width,就根据比列来重新分配
    innerTableColumns() {
      // 第一次初始值不进行什么操作
      if (this.tableClientWidth === 100) return this.innerColumns;
      let clientFont = this.fontSize / 16;
      let index = this.innerColumns.findIndex((col) => !col.width);
      if (index === -1) {
        this.$nextTick(() => {
          const { tableClientWidth } = this; // 表格总宽度
          let total = 0;
          this.innerColumns.forEach((item) => {
            total += +(item.propWidth || item.width) * clientFont;
          });
          this.innerColumns.forEach((item) => {
            item.propWidth = item.propWidth || item.width;
            item.originWidth = item.originWidth || item.propWidth * clientFont; //保存初始值
            item.width = (((item.propWidth * clientFont) / total) * tableClientWidth).toFixed(2);
            console.log(item.originWidth, item.width);
          });
          return this.innerColumns;
        });
        return this.innerColumns;
      } else {
        this.innerColumns.forEach((item) => {
          item.propWidth = item.propWidth || item.width;
          item.width = item.originWidth || item.propWidth * clientFont; //还原初始值
        });
        return this.innerColumns;
      }
    }
  },
  watch: {
    innerTableColumns: {
      immediate: true,
      handler() {
        // 宽度改变之后慢一拍，需强制刷新一下
        this.$nextTick(() => {
          this.$forceUpdate();
        });
      }
    },
    loading: {
      immediate: true,
      handler(val) {
        this.innerLoading = val;
      }
    },
    pageSize: {
      immediate: true,
      handler(val) {
        this.innerPageSize = val;
      }
    },
    innerPageSize(newVal, oldVal) {
      this.$nextTick(() => {
        this.innerPageSize = newVal;
        if (oldVal !== newVal) {
          this.$emit('update:pageSize', newVal);
          this.$emit('size-change', this.innerPageSize);
          this.$emit('pagination-change', {
            pageSize: this.innerPageSize,
            currentPage: this.internalCurrentPage
          });
        }
      });
    },
    currentPage: {
      immediate: true,
      handler(val) {
        this.innerCurrentPage = val;
      }
    },
    innerCurrentPage(newVal, oldVal) {
      this.$nextTick(() => {
        this.internalCurrentPage = newVal;
        if (oldVal !== newVal) {
          this.$emit('update:currentPage', newVal);
          this.$emit('current-page-change', this.internalCurrentPage);
          this.$emit('pagination-change', {
            pageSize: this.innerPageSize,
            currentPage: this.internalCurrentPage
          });
        }
      });
    },
    paginationProps: {
      immediate: true,
      handler(val) {
        if (this.paginationShow) {
          this.innerPaginationProps = { ...DefaultPaginationProps, ...val };

          if (this.innerPaginationProps.pageSizes.indexOf(this.innerPageSize) === -1) {
            // console.warn(
            //   `[pub-table]: pageSize ${this.innerPageSize} is not included in pageSizes[${this.innerPaginationProps.pageSizes}], set pageSize to pageSizes[0]: ${this.innerPaginationProps.pageSizes[0]}`
            // );
            this.innerPageSize = this.innerPaginationProps.pageSizes[0];
          }
        } else {
          this.innerPageSize = this.curTableData.length;
        }
      }
    }
  },
  mounted() {
    this.$EventBus.$on('visible.window.resize', () => {
      this.$nextTick(() => {
        this.getTableClientWidth();
        this.$forceUpdate();
      });
    });
    this.getTableClientWidth();
    // 将elTable的事件注册到本组件上
    delegate.call(this, this.pubTable, [
      'clearSelection',
      'toggleRowSelection',
      'toggleAllSelection',
      'toggleRowExpansion',
      'setCurrentRow',
      'clearSort',
      'clearFilter',
      'doLayout',
      'sort'
    ]);
    if (this.showSortTable) {
      this.$nextTick(() => {
        this.setSortTable();
      });
    }
  },

  // deactivated() {
  //   if (this.tableType === 'async-table') this.curTableData = []; // async-table 离开的时候清空数据 修改tip bug
  // },
  beforeDestroy() {
    this.$EventBus.$off('visible.window.resize');
  },
  methods: {
    getTableClientWidth() {
      this.tableClientWidth = (this.pubTable.$el && this.pubTable.$el.clientWidth) || this.width || 1000; // 表格总宽度
    },
    renderTool() {
      return this.toolBarShow ? <div class="pub-table__tool">{this.$slots['tool']}</div> : null;
    },
    renderTable() {
      return (
        <div class="pub-table__table">
          <el-table
            ref="pubTable"
            data={this.curTableData}
            empty-text={this.innerLoading ? ' ' : '暂 无 数 据'}
            border={this.border}
            height={this.height}
            stripe={this.stripe}
            row-key={this.rowKey}
            highlightCurrentRow={this.highlightCurrentRow}
            cell-class-name={this.cellClassName}
            header-cell-class-name={this.headerCellClassName}
            row-class-name={this.rowClassName}
            {...{
              attrs: {
                'element-loading-text': '拼命加载中',
                'element-loading-spinner': 'el-icon-loading',
                ...this.$attrs
              },
              on: {
                'selection-change': this.handleSelectionChange,
                'sort-change': this.handleSortChange,
                ...this.$listeners
              },
              directives: this.showDirectives
                ? [
                    {
                      name: 'loading',
                      value: this.innerLoading
                    }
                  ]
                : undefined
            }}
          >
            {this.innerTableColumns.length && this.renderTableColumns(this.innerTableColumns)}
            {this.$slots.default}
            <template slot="empty">{this.$slots.empty}</template>
            <template slot="append">{this.$slots.append}</template>
          </el-table>
        </div>
      );
    },
    // 用于全文检索渲染关键字
    renderHtml(value = '') {
      // 限定 包含 <b class='key' style='color:red'> 这个才使用v-html ,减小XSS攻击可能行
      return value && value.includes("<b class='key' style='color:red'>") ? (
        <span
          {...{
            domProps: {
              innerHTML: value
            }
          }}
        ></span>
      ) : (
        value
      );
    },
    // 单击可复制
    renderCopyRow(value = '') {
      return value ? (
        <el-tooltip content="单击可复制" placement="top">
          <span
            {...{
              directives: [
                {
                  name: 'clipboard',
                  value: value
                }
              ]
            }}
          >
            {value}
          </span>
        </el-tooltip>
      ) : (
        value
      );
    },

    renderTableColumns(columns) {
      return columns.map((item) => {
        const props = {
          props: { showOverflowTooltip: true, ...item } //默认超长提示
        };
        props.scopedSlots = props.scopedSlots = {};

        // 渲染表格 内容
        if (item.render) {
          props.scopedSlots.default = (scope) => <Render render={item.render} {...scope}></Render>;
        } else {
          if (item.customColumn) {
            // 自定义展示字段
            props.scopedSlots.default = (scope) => scope.row[item.customColumn || item.prop];
          } else if (this.showType === 'html' && item.type !== 'selection') {
            props.scopedSlots.default = (scope) => this.renderHtml(scope.row[item.customColumn || item.prop]);
          } else if (item.isCopy) {
            props.scopedSlots.default = (scope) => this.renderCopyRow(scope.row[item.customColumn || item.prop]);
          }
        }
        // 渲染表格头部
        if (item.renderHeader) {
          props.scopedSlots.header = (scope) => <Render render={item.header} {...scope}></Render>;
        }
        return <el-table-column {...props}></el-table-column>;
      });
    },
    renderPagination() {
      return this.paginationShow || this.batchBtn ? (
        <el-row class="pub-table__bottom" justify="end" align="middle">
          <el-col span={this.batchBtnSize} xs={24}>
            {this.renderBatchBtn()}
          </el-col>
          {this.paginationShow ? (
            <el-col span={24 - this.batchBtnSize} xs={24}>
              <el-pagination
                ref="elPagination"
                {...{
                  attrs: this.innerPaginationProps,
                  on: {
                    'size-change': this.handleSizeChange,
                    'prev-click': this.handlePrevClick,
                    'next-click': this.handleNextClick,
                    'current-change': this.handleCurrentChange
                  }
                }}
                current-page={this.innerCurrentPage}
                page-size={this.innerPageSize}
                total={this.innerTotal}
              >
                {this.$slots.pagination}
              </el-pagination>
            </el-col>
          ) : null}
        </el-row>
      ) : null;
    },
    handleSortChange(column) {
      this.$emit('sort-change', column);
    },
    handleSelectionChange(selection) {
      this.selectionList = selection;
      this.$emit('selection-change', selection);
    },
    handleSizeChange(size) {
      this.innerPageSize = size;
    },
    handlePrevClick(page) {
      this.$emit('prev-click', page);
    },
    handleNextClick(page) {
      this.$emit('next-click', page);
    },
    handleCurrentChange(page) {
      this.innerCurrentPage = page;
    },
    // 拖拽事件
    setSortTable() {
      const el = this.pubTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0];
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost',
        onEnd: (evt) => {
          this.$emit('set-sort-Table', evt);
        }
      });
    }
  },
  render() {
    const layoutMap = {
      tool: this.renderTool(),
      table: this.renderTable(),
      pagination: this.renderPagination()
    };
    return this.tableCard ? (
      <el-card class="pub-card">
        {this.title || this.$slots.headerLeft || this.$slots.headerRight ? (
          <div slot="header" class="pub-card__header">
            <div class="pub-card__header-left">
              {this.title}
              {this.showColumnFilter ? this.renderColumnFilter() : null}
              {this.$slots.headerLeft}
            </div>
            <div class="pub-card__header-right">{this.$slots.headerRight}</div>
          </div>
        ) : null}
        <div class="pub-card__body pub-table">{Object.keys(layoutMap).map((layout) => layoutMap[layout])}</div>
      </el-card>
    ) : (
      <div class="pub-card__body pub-table pub-table__body">
        {Object.keys(layoutMap).map((layout) => layoutMap[layout])}
      </div>
    );
  }
};
