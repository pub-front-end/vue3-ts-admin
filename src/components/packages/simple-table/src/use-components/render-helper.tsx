import { emitter } from '@/utils/emitter';
import { computed, getCurrentInstance, nextTick, onBeforeMount, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import '../style/index.scss';
import useColumnFilter from './column-filter-helper';
import { ItableProps } from './props-helper';
import { delegate } from './tools';

const defaultPaginationProps = {
  pageSizes: [15, 30, 50, 100],
  layout: '->, total, sizes, prev, pager, next, jumper'
};

function useTableCore(props: ItableProps, emit: any) {
  const { renderColumnFilter, innerColumns } = useColumnFilter(props);
  let vm: any = getCurrentInstance();
  console.log(`vm----------`, vm, innerColumns);
  let tableClientWidth = ref(100); //表格宽度
  let curTableData = ref([] as any[]);
  let selectionList: any[]; // 选中数组
  let innerLoading = ref(false);
  let showDirectives = ref(false);
  let innerCurrentPage = ref(1);
  let innerTotal = ref(0);
  let innerPageSize = ref(10);

  let innerPaginationProps = ref(defaultPaginationProps);
  const layouts = computed(() => props.layout.split(',').map((item: string) => item.trim()));
  const paginationShow = computed(() => layouts.value.includes('pagination'));
  const toolBarShow = computed(() => layouts.value.includes('tool') && vm.slots.tool);

  //最后使用的table-column
  const innerTableColumns = computed(() => {
    const tempColumn = [...innerColumns.value];
    console.log(`computed--innerTableColumns`, tableClientWidth.value, tempColumn);
    // 第一次初始值不进行什么操作
    if (tableClientWidth.value === 100) return tempColumn;
    let index = tempColumn.findIndex((col: any) => !col.width);
    if (index === -1) {
      nextTick(() => {
        let total = 0;
        tempColumn.forEach((item) => {
          total += +(item.propWidth || item.width);
        });
        tempColumn.forEach((item) => {
          item.propWidth = item.propWidth || item.width;
          item.originWidth = item.originWidth || item.propWidth; //保存初始值
          item.width = ((item.propWidth / total) * tableClientWidth.value).toFixed(2);
          console.log(item.originWidth, item.width);
        });
        return tempColumn;
      });
      return tempColumn;
    } else {
      tempColumn.forEach((item) => {
        console.log(`item`, item.propWidth, item.width);
        item.propWidth = item.propWidth || item.width;
        item.width = item.originWidth || item.propWidth; //还原初始值
        if (!item.width) {
          delete item.width;
          delete item.propWidth;
        }
      });
      console.log(`tempColumn`, tempColumn);
      return tempColumn;
    }
  });
  function renderTableColumns(columns: any[]) {
    const result = columns.map((item) => {
      const columnConfig: any = {
        scopedSlots: {},
        props: { showOverflowTooltip: true, ...item }
      };
      // 渲染表格 内容
      if (item.render) {
        columnConfig.scopedSlots.default = (scope: Pub.Scope) => <render render={item.render} scope={scope}></render>;
      } else {
        if (item.customColumn) {
          // 自定义展示字段
          columnConfig.scopedSlots.default = (scope: any) => scope.row[item.customColumn || item.prop];
        } else if (props.showType === 'html' && item.type !== 'selection') {
          // columnConfig.scopedSlots.default = (scope: any) => renderHtml(scope.row[item.customColumn || item.prop]);
        } else if (item.isCopy) {
          // prcolumnConfigops.scopedSlots.default = (scope: any) => renderCopyRow(scope.row[item.customColumn || item.prop]);
        }
      }
      // 渲染表格头部
      if (item.renderHeader) {
        columnConfig.scopedSlots.header = (scope: any) => <render render={item.header} scope={scope}></render>;
      }

      return <el-table-column {...columnConfig.props} v-slots={columnConfig.scopedSlots}></el-table-column>;
    });
    return result;
  }
  function renderTable() {
    return (
      <div class="pub-table__table">
        <el-table
          ref="pubTable"
          v-loading={innerLoading.value}
          data={curTableData.value}
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
            ...vm.attrs,
            'element-loading-text': '拼命加载中',
            'element-loading-spinner': 'el-icon-loading',
            onSelectionChange: handleSelectionChange,
            onSortChange: handleSortChange
          }}
          v-slots={{ append: vm.slots.append }}
        >
          {innerTableColumns.value.length && renderTableColumns(innerTableColumns.value)}
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
                ...innerPaginationProps.value,
                onSizeChange: handleSizeChange,
                onPrevClick: handlePrevClick,
                onNextClick: handleNextClick,
                onCurrentChange: handleCurrentChange
              }}
              current-page={innerCurrentPage.value}
              page-size={innerPageSize.value}
              total={innerTotal.value}
            >
              {vm.slots.pagination && vm.slots.pagination()}
            </el-pagination>
          </el-col>
        ) : null}
      </el-row>
    ) : null;
  }
  function renderTool() {
    return toolBarShow.value ? <div class="pub-table__tool">{vm.slots.tool && vm.slots.tool()}</div> : null;
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
              {props.title + props.tableCard}
              {props.showColumnFilter ? renderColumnFilter() : null}
              {vm.slots.headerLeft && vm.slots.headerLeft()}
            </div>
            <div class="pub-card__header-right">{vm.slots.headerRight && vm.slots.headerRight()}</div>
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
  watch(
    () => props.paginationProps,
    (val) => {
      if (paginationShow.value) {
        innerPaginationProps.value = { ...defaultPaginationProps, ...val };

        if (!innerPaginationProps.value.pageSizes.includes(innerPageSize.value)) {
          innerPageSize.value = innerPaginationProps.value.pageSizes[0];
        }
      }
    },
    {
      immediate: true
    }
  );
  watch(
    () => innerTableColumns,
    () => {
      // 宽度改变之后慢一拍，需强制刷新一下
      console.log(`11111111`, 11111111);
      nextTick(() => {
        vm?.update(); //todo   update不知道能否使用
      });
    }
  );
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
  function getTableClientWidth() {
    tableClientWidth.value = (vm.refs.pubTable.$el && vm.refs.pubTable.$el.clientWidth) || props.width || 1000; // 表格总宽度
  }
  function handleSortChange(column: any[]) {
    emit('sort-change', column);
  }
  function handleSelectionChange(selection: any[]) {
    console.log(`handleSelectionChange`, 111111);
    selectionList = selection;
    emit('selection-change', selectionList);
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

  onBeforeMount(() => {
    vm = getCurrentInstance(); //获取组件实例
  });

  return { curTableData, showDirectives, renderLayout };
}

export default useTableCore;
