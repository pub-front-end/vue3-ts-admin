// import BatchBtn from './batch-btn';
// import ColumnFilter from './column-filter';
import { emitter } from '@/utils/emitter';
import Sortable from 'sortablejs';
import {
  computed,
  getCurrentInstance,
  nextTick,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch
} from 'vue';
import '../style/index.scss';
import { delegate } from '../utils/tools';
import useColumnFilter from './column-filter-helper';
import { ItableProps } from './props-helper';

const DefaultPaginationProps = {
  pageSizes: [15, 30, 50, 100],
  layout: '->, total, sizes, prev, pager, next, jumper'
};

function useTableCore(props: ItableProps, emit: any) {
  const { innerColumns, renderColumnFilter } = useColumnFilter(props);
  let vm: any = getCurrentInstance();
  let tableClientWidth = ref(100); //表格宽度
  let innerLoading = ref(false);
  let innerCurrentPage = ref(1);
  let innerTotal = ref(0);
  let innerPageSize = ref(10);
  let innerPaginationProps = reactive(DefaultPaginationProps);
  let sortable = reactive({}); // 拖拽table对象
  let sortableData: any[] = reactive([]);
  let curTableData: any[] = reactive([]);
  let showDirectives = ref(false); // 异步请求使用loading指令
  let selectionList: any[] = reactive([]); // 选中数组
  const layouts = computed(() => props.layout.split(',').map((item: string) => item.trim()));
  const paginationShow = computed(() => layouts.value.includes('pagination'));
  const toolBarShow = computed(() => layouts.value.includes('tool') && vm?.slots?.tool);

  const innerTableColumns = computed(() => {
    // 第一次初始值不进行什么操作
    if (tableClientWidth.value === 100) return innerColumns;
    let index = innerColumns.value.findIndex((col: any) => !col.width);
    if (index === -1) {
      nextTick(() => {
        let total = 0;
        innerColumns.value.forEach((item) => {
          total += +(item.propWidth || item.width);
        });
        innerColumns.value.forEach((item) => {
          item.propWidth = item.propWidth || item.width;
          item.originWidth = item.originWidth || item.propWidth; //保存初始值
          item.width = ((item.propWidth / total) * tableClientWidth.value).toFixed(2);
          console.log(item.originWidth, item.width);
        });
        return innerColumns;
      });
      return innerColumns;
    } else {
      innerColumns.value.forEach((item) => {
        item.propWidth = item.propWidth || item.width;
        item.width = item.originWidth || item.propWidth; //还原初始值
      });
      return innerColumns;
    }
  });

  watch(
    () => innerTableColumns,
    () => {
      // 宽度改变之后慢一拍，需强制刷新一下
      nextTick(() => {
        vm?.update(); //todo   update不知道能否使用
      });
    }
  );
  watch(
    () => props.loading,
    (val) => {
      innerLoading.value = val;
    }
  );
  watch(
    () => props.pageSize,
    (val) => {
      innerPageSize.value = val;
    }
  );
  watch(
    () => innerPageSize,
    (val, preVal) => {
      nextTick(() => {
        if (val !== preVal) {
          emit('update:pageSize', val.value);
          emit('size-change', val.value);
          emit('pagination-change', {
            pageSize: val.value,
            currentPage: innerCurrentPage.value
          });
        }
      });
    }
  );

  watch(
    () => props.currentPage,
    (val) => {
      innerCurrentPage.value = val;
    }
  );
  watch(
    () => innerCurrentPage,
    (val, preVal) => {
      nextTick(() => {
        if (val !== preVal) {
          emit('update:currentPage', val.value);
          emit('current-page-change', val.value);
          emit('pagination-change', {
            pageSize: innerPageSize.value,
            currentPage: val.value
          });
        }
      });
    }
  );
  watch(
    () => props.paginationProps,
    (val) => {
      if (paginationShow.value) {
        innerPaginationProps = { ...DefaultPaginationProps, ...val };

        if (!innerPaginationProps.pageSizes.includes(innerPageSize.value)) {
          innerPageSize.value = innerPaginationProps.pageSizes[0];
        }
      }
    },
    {
      immediate: true
    }
  );

  onBeforeMount(() => {
    vm = getCurrentInstance(); //获取组件实例
  });
  onMounted(() => {
    emitter.on('visible.window.resize', handleVisibleResize);
    getTableClientWidth();
    // 将elTable的事件注册到本组件上
    const events = [
      'clearSelection',
      'toggleRowSelection',
      'toggleAllSelection',
      'toggleRowExpansion',
      'setCurrentRow',
      'clearSort',
      'clearFilter',
      'doLayout',
      'sort'
    ];
    delegate.call(vm, vm.refs.pubTable, events);

    if (props.showSortTable) {
      nextTick(() => {
        setSortTable();
      });
    }
  });
  onBeforeUnmount(() => {
    emitter.off('visible.window.resize', handleVisibleResize);
  });

  function handleVisibleResize() {
    nextTick(() => {
      getTableClientWidth();
      vm?.update();
    });
  }
  // 拖拽事件
  function setSortTable() {
    const el = vm.refs.pubTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0];
    sortable = Sortable.create(el, {
      ghostClass: 'sortable-ghost',
      onEnd: (evt) => {
        emit('set-sort-Table', evt);
      }
    });
  }
  function getTableClientWidth() {
    tableClientWidth.value = (vm.refs.pubTable.$el && vm.refs.pubTable.$el.clientWidth) || props.width || 1000; // 表格总宽度
  }

  function renderTool() {
    return toolBarShow.value ? <div class="pub-table__tool">{vm?.slots['tool']}</div> : null;
  }
  function renderTableColumns(columns: any[]) {
    return columns.map((item) => {
      const props: any = {
        scopedSlots: {},
        props: { showOverflowTooltip: true, ...item } //默认超长提示
      };
      // 渲染表格 内容
      if (item.render) {
        props.scopedSlots.default = (scope: any) => <render render={item.render} {...scope}></render>;
      } else {
        if (item.customColumn) {
          // 自定义展示字段
          props.scopedSlots.default = (scope: any) => scope.row[item.customColumn || item.prop];
        } else if (props.showType === 'html' && item.type !== 'selection') {
          // props.scopedSlots.default = (scope: any) => renderHtml(scope.row[item.customColumn || item.prop]);
        } else if (item.isCopy) {
          // props.scopedSlots.default = (scope: any) => renderCopyRow(scope.row[item.customColumn || item.prop]);
        }
      }
      // 渲染表格头部
      if (item.renderHeader) {
        props.scopedSlots = { header: null };
        props.scopedSlots.header = (scope: any) => <render render={item.header} {...scope}></render>;
      }
      return <el-table-column {...props}></el-table-column>;
    });
  }
  function renderTable() {
    return (
      <div class="pub-table__table">
        <el-table
          ref="pubTable"
          data={curTableData}
          empty-text={innerLoading.value ? ' ' : '暂 无 数 据'}
          border={props.border}
          height={props.height}
          stripe={props.stripe}
          row-key={props.rowKey}
          highlightCurrentRow={props.highlightCurrentRow}
          cell-class-name={props.cellClassName}
          header-cell-class-name={props.headerCellClassName}
          row-class-name={props.rowClassName}
          {...{
            attrs: {
              'element-loading-text': '拼命加载中',
              'element-loading-spinner': 'el-icon-loading',
              ...vm.attrs
            },
            on: {
              'selection-change': handleSelectionChange,
              'sort-change': handleSortChange,
              ...vm.listeners
            },
            directives: showDirectives.value
              ? [
                  {
                    name: 'loading',
                    value: innerLoading
                  }
                ]
              : undefined
          }}
          v-slots={vm.slots}
        >
          {innerTableColumns.value && renderTableColumns(innerTableColumns.value.value)}
        </el-table>
      </div>
    );
  }
  function renderPagination() {
    return paginationShow.value || props.batchBtn ? (
      <el-row class="pub-table__bottom" justify="end" align="middle">
        {/* <el-col span={this.batchBtnSize} xs={24}>
          {this.renderBatchBtn()}
        </el-col> */}
        {paginationShow.value ? (
          <el-col span={24 - 0} xs={24}>
            <el-pagination
              ref="elPagination"
              {...{
                attrs: innerPaginationProps,
                on: {
                  'size-change': handleSizeChange,
                  'prev-click': handlePrevClick,
                  'next-click': handleNextClick,
                  'current-change': handleCurrentChange
                }
              }}
              current-page={innerCurrentPage}
              page-size={innerPageSize}
              total={innerTotal}
            >
              {vm.slots.pagination}
            </el-pagination>
          </el-col>
        ) : null}
      </el-row>
    ) : null;
  }

  function handleSortChange(column: any[]) {
    emit('sort-change', column);
  }
  function handleSelectionChange(selection: any[]) {
    selectionList = selection;
    emit('selection-change', selection);
  }
  function handleSizeChange(size: number) {
    innerPageSize.value = size;
  }
  function handlePrevClick(page: number) {
    emit('prev-click', page);
  }
  function handleNextClick(page: number) {
    emit('next-click', page);
  }
  function handleCurrentChange(page: number) {
    innerCurrentPage.value = page;
  }
  function renderLayout() {
    const layoutMap: any = {
      tool: renderTool(),
      table: renderTable(),
      pagination: renderPagination()
    };
    const titleSlot = {
      header: () =>
        props.title || vm.slots.headerLeft || vm.slots.headerRight ? (
          <div class="pub-card__header">
            <div class="pub-card__header-left">
              {props.title}
              {props.showColumnFilter ? renderColumnFilter() : null}
              {vm.slots.headerLeft}
            </div>
            <div class="pub-card__header-right">{vm.slots.headerRight}</div>
          </div>
        ) : null
    };
    return props.tableCard ? (
      <el-card class="pub-card" v-slots={titleSlot}>
        <div class="pub-card__body pub-table">{Object.keys(layoutMap).map((layout) => layoutMap[layout])}</div>
      </el-card>
    ) : (
      <div class="pub-card__body pub-table pub-table__body">
        {Object.keys(layoutMap).map((layout) => layoutMap[layout])}
      </div>
    );
  }
  return {
    layouts,
    paginationShow,
    toolBarShow,
    tableClientWidth,
    innerLoading,
    innerCurrentPage,
    innerTotal,
    curTableData,
    innerPageSize,
    innerPaginationProps,
    sortable,
    sortableData,
    showDirectives,
    selectionList,
    innerTableColumns,
    renderLayout
  };
}

export default useTableCore;
