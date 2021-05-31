import { getStyle, hasClass } from 'element-plus/packages/utils/dom';
import ColumnFilter from './mixins/column-filter';
import { debounce, getCell } from './utils/tools.js';

const cubic = (value) => Math.pow(value, 3);
const easeInOutCubic = (value) => (value < 0.5 ? cubic(value * 2) / 2 : 1 - cubic((1 - value) * 2) / 2);

export default {
  name: 'PubCustomTable',
  mixins: [ColumnFilter],
  props: {
    title: { type: String, default: '' }, // 表格标题
    // table 数据
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    pageSize: { type: Number, default: 15 }, // 一页显示数目
    // 列数据渲染 数组
    columns: {
      type: Array,
      default: () => []
    },

    showColumnFilter: { type: Boolean, default: true }, // 是否显示列表筛选popover
    showHeader: { type: Boolean, default: true }, // 是否显示列表头
    // el-table自带 高度（固定高度，超长出现内部滚动条）
    height: { type: [String, Number], default: '100%' },
    width: { type: [String, Number, undefined], default: undefined },
    isScroll: { type: Boolean, default: true }, // 是否自动滚动
    scrollInterval: { type: Number, default: 3000 } // 自动滚动时间间隔
  },
  data() {
    return {
      tableClientWidth: 100, //table默认宽度
      tableTimer: 0, //table默认宽度
      tooltipContent: ''
    };
  },
  computed: {
    tableBodyContainer() {
      return this.$refs.tableBodyContainer;
    },
    scrollWrapper() {
      return this.$refs.tableScrollContainer?.$refs.wrap;
    },
    pubCustomTable() {
      return this.$refs.pubCustomTable;
    },
    isShowTableTitle() {
      return (
        this.title ||
        this.$slots.titleLeft ||
        this.$slots.titleCenter ||
        this.$slots.titleRight ||
        this.$slots.showColumnFilter
      );
    },
    curTableData() {
      if (this.pageSize && this.innerTotal) {
        return this.data.slice(0, this.pageSize);
      }
      return this.data;
    },
    innerTotal() {
      return this.data.length;
    },
    // 根据是否配置width来计算列宽，如果存在一个列没有配置width，则按照分配的来；如果所有列都分配了width,就根据比列来重新分配
    innerTableColumns() {
      const { tableClientWidth } = this; // 表格总宽度
      // 第一次初始值不进行什么操作
      if (tableClientWidth === 100) return this.innerColumns;
      let clientFont = this.fontSize / 16;
      let index = this.innerColumns.findIndex((col) => !col.width);
      let total = 0; //当前width总宽度
      let noWidthNum = 0; //没有宽度的列数
      this.innerColumns.forEach((item) => {
        item.propWidth = item.propWidth || item.width;
        if ((!isNaN(item.width) && typeof item.width === 'number') || typeof item.width === 'string') {
          total += +item.propWidth * clientFont;
        } else {
          noWidthNum++;
        }
      });
      //都有宽度，则重新计算占比
      if (index === -1) {
        this.$nextTick(() => {
          this.innerColumns.forEach((item) => {
            item.innerWidth = ((item.width / total) * tableClientWidth).toFixed(2);
          });
          return this.innerColumns;
        });
        return this.innerColumns;
      } else {
        let averageWidth = (tableClientWidth - total) / noWidthNum;
        this.innerColumns.forEach((item) => {
          item.propWidth = item.propWidth || item.width;
          item.innerWidth =
            (!isNaN(item.width) && typeof item.width === 'number') || typeof item.width === 'string'
              ? item.propWidth * clientFont
              : averageWidth; //还原初始值
        });
        return this.innerColumns;
      }
    }
  },
  created() {
    this.activateTooltip = debounce((tooltip) => tooltip.handleShowPopper(), 50);
  },
  mounted() {
    this.$EventBus.$on('visible.window.resize', () => {
      this.$nextTick(() => {
        this.getTableClientWidth();
        this.$forceUpdate();
      });
    });
    this.getTableClientWidth();
    if (this.isScroll) {
      this.initScroll();
      this.initEvent();
    }
  },
  activated() {
    if (this.isScroll) {
      this.initScroll();
      this.initEvent();
    }
  },
  detactivated() {
    if (this.isScroll) {
      this.offEvent();
      clearInterval(this.tableTimer);
    }
  },
  beforeDestroy() {
    if (this.isScroll) {
      this.offEvent();
      clearInterval(this.tableTimer);
    }
    this.$EventBus.$off('visible.window.resize');
  },
  methods: {
    getTableClientWidth() {
      this.$nextTick(() => {
        this.tableClientWidth =
          (this.tableBodyContainer && this.tableBodyContainer.clientWidth - 32) || this.width || 1000; // 表格总宽度
      });
    },
    // 滚动动画效果
    scrollTo(el, beginValue, endValue) {
      const beginTime = Date.now();
      const rAF = window.requestAnimationFrame || ((func) => setTimeout(func, 16));
      const frameFunc = () => {
        const progress = (Date.now() - beginTime) / 500;
        if (progress < 1) {
          let scrollTop = beginValue + (endValue - beginValue) * easeInOutCubic(progress);
          el.scrollTop = scrollTop;
          rAF(frameFunc);
        } else {
          el.scrollTop = endValue;
        }
      };
      rAF(frameFunc);
    },
    initScroll() {
      this.$nextTick(() => {
        const scrollWrapper = this.$refs.tableScrollContainer?.$refs.wrap;
        const el = document.querySelectorAll(`.pub-custom-table__body tr`)[0];
        if (!el) {
          setTimeout(() => {
            this.initScroll();
          }, 200);
          return;
        }
        const trClientHeight = el.clientHeight; // 获取一行的高度

        const { scrollHeight, offsetHeight } = scrollWrapper;
        const maxScrollTop = scrollHeight - offsetHeight;

        clearInterval(this.tableTimer);
        this.tableTimer = setInterval(() => {
          let scrollEnd = scrollWrapper.scrollTop >= maxScrollTop ? 0 : scrollWrapper.scrollTop + trClientHeight;
          this.scrollTo(scrollWrapper, scrollWrapper.scrollTop, scrollEnd);
        }, 2000);
      });
    },
    initEvent() {
      this.$nextTick(() => {
        if (!this.tableBodyContainer) {
          setTimeout(() => {
            this.initEvent();
          }, 200);
          return;
        }
        this.tableBodyContainer?.addEventListener('mouseover', this.handleMouseOver);
        this.tableBodyContainer?.addEventListener('mouseleave', this.handleMouseLeave);
      });
    },
    offEvent() {
      this.tableBodyContainer?.removeEventListener('mouseover', this.handleMouseOver);
      this.tableBodyContainer?.removeEventListener('mouseleave', this.handleMouseLeave);
    },
    handleMouseOver() {
      if (this.tableTimer) {
        clearInterval(this.tableTimer);
        this.tableTimer = 0;
      }
    },
    handleMouseLeave() {
      this.initScroll();
    },

    handleCellMouseEnter(event) {
      const cell = getCell(event);

      // 判断是否text-overflow, 如果是就显示tooltip
      const cellChild = event.target.querySelector('.cell');
      if (!(hasClass(cellChild, 'el-tooltip') && cellChild.childNodes.length)) {
        return;
      }
      // use range width instead of scrollWidth to determine whether the text is overflowing
      // to address a potential FireFox bug: https://bugzilla.mozilla.org/show_bug.cgi?id=1074543#c3
      //计算是否超长
      const range = document.createRange();
      range.setStart(cellChild, 0);
      range.setEnd(cellChild, cellChild.childNodes.length);
      const rangeWidth = range.getBoundingClientRect().width;
      const padding =
        (parseInt(getStyle(cellChild, 'paddingLeft'), 10) || 0) +
        (parseInt(getStyle(cellChild, 'paddingRight'), 10) || 0);
      if (
        (rangeWidth + padding > cellChild.offsetWidth || cellChild.scrollWidth > cellChild.offsetWidth) &&
        this.$refs.tooltip
      ) {
        const tooltip = this.$refs.tooltip;
        // TODO 会引起整个 Table 的重新渲染，需要优化
        this.tooltipContent = cell.innerText || cell.textContent;
        tooltip.referenceElm = cell;
        tooltip.$refs.popper && (tooltip.$refs.popper.style.display = 'none');
        tooltip.doDestroy();
        tooltip.setExpectedState(true);
        this.activateTooltip(tooltip);
      }
    },

    handleCellMouseLeave() {
      const tooltip = this.$refs.tooltip;
      if (tooltip) {
        tooltip.setExpectedState(false);
        tooltip.handleClosePopper();
      }
    },

    renderCell(h) {
      return this.curTableData.map((row, index) => {
        return (
          <tr>
            {this.innerTableColumns?.map((col) => {
              const content = typeof col.render === 'function' ? col.render(h, { row, $index: index }) : row[col.prop];
              return (
                <td
                  onMouseenter={($event) => {
                    this.handleCellMouseEnter($event);
                  }}
                  onMouseleave={($event) => this.handleCellMouseLeave($event)}
                >
                  <div
                    class={col.showOverflowTooltip !== false ? 'cell el-tooltip' : 'cell'}
                    style={col.innerWidth ? `width:${col.innerWidth}px;` : ''}
                  >
                    {content}
                  </div>
                </td>
              );
            })}
          </tr>
        );
      });
    }
  },
  render(h) {
    return (
      <div class="pub-custom-table">
        {this.isShowTableTitle ? (
          <div class="pub-custom-table__title">
            <div class="pub-custom-table__title__left">
              {this.title}
              {this.$slots.titleLeft}
              {this.showColumnFilter ? this.renderColumnFilter() : null}
              {this.$slots.titleCenter}
            </div>
            <div class="pub-custom-table__title__right">{this.$slots.titleRight}</div>
          </div>
        ) : null}
        <div class="pub-custom-table__header">
          <table class="pub-custom-table__header__table" cellspacing="0" cellpadding="0" border="0">
            <colgroup>
              {this.innerTableColumns?.map((col) => {
                return <col style={col.innerWidth ? `width:${col.innerWidth}px;` : ''}></col>;
              })}
            </colgroup>
            <thead>
              {this.showHeader ? (
                <tr>
                  {this.innerTableColumns?.map((col) => {
                    return <th> {col.label}</th>;
                  })}
                </tr>
              ) : null}
            </thead>
          </table>
        </div>
        <div ref="tableBodyContainer" class="pub-custom-table__body">
          <el-scrollbar ref="tableScrollContainer" class="table-scrollbar">
            <table
              ref="pubCustomTable"
              class="pub-custom-table__body__table"
              cellspacing="0"
              cellpadding="0"
              border="0"
            >
              <colgroup>
                {this.innerTableColumns?.map((col) => {
                  return <col style={col.innerWidth ? `width:${col.innerWidth}px;` : ''}></col>;
                })}
              </colgroup>

              <tfoot></tfoot>
              <tbody>
                {this.curTableData.length ? this.renderCell(h) : <div class="none-data">暂无数据</div>}
                <el-tooltip placement="top" ref="tooltip" content={this.tooltipContent}></el-tooltip>
              </tbody>
            </table>
          </el-scrollbar>
        </div>
      </div>
    );
  }
};
