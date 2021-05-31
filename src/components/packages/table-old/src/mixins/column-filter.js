import HttpService from '@/utils/http-service';
import Sortable from 'sortablejs';

// 监测设备监测口表格数据分页查询
const findPageConfig = (pageId) =>
  HttpService.request({
    url: '/personalizedPage/find/' + pageId,
    method: 'get'
  });
const updatePageConfig = (data) =>
  HttpService.request({
    url: '/personalizedPage/set',
    method: 'post',
    data: data
  });

export default {
  props: {
    pageId: String //每个表格独有的名称 用于保存表格列到数据库
  },
  data() {
    return {
      sortColumns: [], // 有序的column数组
      preSortColumns: [], // 编辑时有序的column数组
      checkedColumn: [], // 选中的数组
      preCheckedColumn: [], // 改变的数组
      labelSortList: [], // 标签排序数组
      originLabelList: [], // 最初的标签数组
      isShowPopover: false,
      sortColumn: null // 拖拽列对象
    };
  },
  computed: {
    columnFilter() {
      return this.$refs['column-filter'] || {};
    },

    innerColumnLabelObj() {
      const obj = {};
      this.columns.forEach((e) => {
        obj[e.label] = e;
      });
      return obj;
    },
    innerColumns() {
      const cols = this.sortColumns.filter((e) => e.disabled || this.checkedColumn.includes(e.label));

      return cols;
    }
  },
  watch: {
    isShowPopover(val) {
      if (val) {
        this.$nextTick(() => {
          this.initSortTable();
        });
      } else {
        this.isShowPopover && this.isShowPopover.destroy();
      }
    },
    columns: {
      immediate: true,
      handler() {
        this.sortColumns = this.columns;
        this.preSortColumns = [...this.columns];
        const originLabelList = [];
        this.columns.forEach((e) => {
          originLabelList.push(e.label);
        });
        this.originLabelList = originLabelList;
        this.initFilter();
      }
    }
  },

  methods: {
    async initFilter() {
      let temp = [];
      // 获取初始显示的列
      this.columns.forEach((item) => {
        if (!item.disabled && item.show) {
          temp.push(item.label);
        }
      });

      // 先占个位置 不然布局要出问题
      this.checkedColumn = [...temp];
      this.preCheckedColumn = [...temp];
      // 接口保存到数据库
      if (this.pageId) {
        const { data } = await findPageConfig(this.pageId);
        if (data && data.pageConfig) {
          const pageConfig = JSON.parse(data.pageConfig) || {};
          let { checkedColumn, labelSortList } = pageConfig;
          // 去重
          const totalLabelList = [...new Set([...labelSortList, ...this.originLabelList])];
          // 长度不相等，表示有新增的列
          const isUpdateColums = totalLabelList.length !== labelSortList.length;
          if (isUpdateColums) {
            const newColumns = (labelSortList.length && totalLabelList.slice(labelSortList.length)) || totalLabelList;
            newColumns.forEach((e) => {
              const newIndex = this.originLabelList.findIndex((label) => label === e);
              labelSortList.splice(newIndex, 0, e);
              // 如果默认显示
              if (this.innerColumnLabelObj[e] && this.innerColumnLabelObj[e].show) {
                checkedColumn.push(e);
              }
            });
          }
          let tempColumns = [];
          labelSortList.forEach((e) => {
            this.innerColumnLabelObj[e] && tempColumns.push(this.innerColumnLabelObj[e]);
          });

          this.sortColumns = tempColumns;
          this.preSortColumns = [...tempColumns];

          // 去重
          checkedColumn = [...new Set(checkedColumn)];
          this.checkedColumn = [...checkedColumn];
          this.preCheckedColumn = [...checkedColumn];
          // 如果有新增列，主动保存到数据库
          if (isUpdateColums) {
            //this.saveCheckedColumn();
          }
        }
      }
    },
    saveCheckedColumn() {
      this.checkedColumn = [...this.preCheckedColumn];
      this.sortColumns = [...this.preSortColumns];
      const labelSortList = this.sortColumns.map((e) => e.label);
      const pageConfig = JSON.stringify({
        labelSortList,
        checkedColumn: this.checkedColumn
      });

      if (this.pageId) {
        updatePageConfig({ pageId: this.pageId, pageConfig }).then(() => {
          this.$message.success('保存成功！');
          this.isShowPopover = false;
        });
      } else {
        this.isShowPopover = false;
      }
    },
    cancelCheckedColumn() {
      this.preCheckedColumn = [...this.checkedColumn];
      this.isShowPopover = false;
    },
    // 拖拽事件
    initSortTable() {
      const el = document.querySelectorAll(`.pub-popover--group.${this.pageId}`)[0];
      this.sortColumn = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // drop placeholder的css类名
        onEnd: (event) => {
          const { newIndex, oldIndex } = event;
          this.changeColumn(newIndex, oldIndex);
        }
      });
    },
    //交换新旧index 位置
    changeColumn(newIndex, oldIndex) {
      if (this.preSortColumns[newIndex].disabled) {
        let nextIndex = newIndex;
        // 如果是首尾disabled 表示是全选与操作，不改变位置，改为其最近一位
        if (newIndex === 0) {
          nextIndex = 1;
        } else if (newIndex === this.preSortColumns.length - 1) {
          nextIndex = newIndex - 1;
        }
        this.changeColumn(nextIndex, oldIndex);
      } else {
        // 先将原数组原位置删除元素
        const oldC = this.preSortColumns.splice(oldIndex, 1)[0];
        //再将原数据插入到新位置
        this.preSortColumns.splice(newIndex, 0, oldC);
      }
    },
    renderColumnFilter() {
      return (
        <el-popover
          ref="column-filter"
          class="pub-popover"
          value={this.isShowPopover}
          on-input={(e) => {
            this.isShowPopover = e;
          }}
          on-hide={this.cancelCheckedColumn}
          placement="right"
          width={10.625 * this.fontSize}
          trigger="click"
        >
          <i slot="reference" class="el-icon-s-grid pub-popover--icon">
            {this.isShowPopover}
          </i>
          <div class="pub-popover--tip">
            <span class="pub-popover--tip__mark">*</span>
            拖拽可修改排序
          </div>
          <el-checkbox-group
            class={'pub-popover--group ' + this.pageId}
            value={this.preCheckedColumn}
            on-input={(e) => {
              this.preCheckedColumn = e;
            }}
            min={1}
            max={15}
          >
            {this.sortColumns.map((item) => {
              return (
                <el-checkbox
                  label={item.label}
                  key={item.label}
                  disabled={item.disabled}
                  class={item.disabled ? 'checkbox-hidden' : ''}
                ></el-checkbox>
              );
            })}
          </el-checkbox-group>
          <div class="pub-popover--button">
            <el-button type="primary" size="mini" on-click={this.saveCheckedColumn}>
              提 交
            </el-button>
            <el-button type="text" size="mini" on-click={this.cancelCheckedColumn}>
              取 消
            </el-button>
          </div>
        </el-popover>
      );
    }
  }
};
