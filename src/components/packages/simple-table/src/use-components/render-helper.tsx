import { getCurrentInstance, reactive, ref } from 'vue';
import { ItableProps } from './props-helper';
function useTableCore(props: ItableProps, emit: any) {
  let vm: any = getCurrentInstance();
  let curTableData = ref([] as any[]);
  let selectionList: any[] = reactive([]); // 选中数组
  let innerLoading = ref(false);
  let showDirectives = ref(false);

  function renderTableColumns(columns: any[]) {
    const result = columns.map((item) => {
      const columnConfig: any = {
        scopedSlots: {},
        props: { showOverflowTooltip: true, ...item }
      };
      // 渲染表格 内容
      if (item.render) {
        columnConfig.scopedSlots.default = (scope: any) => <render render={item.render} scope={scope}></render>;
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
          {props.columns && renderTableColumns(props.columns)}
        </el-table>
      </div>
    );
  }
  function handleSortChange(column: any[]) {
    emit('sort-change', column);
  }
  function handleSelectionChange(selection: any[]) {
    console.log(`handleSelectionChange`, 111111);
    selectionList = selection;
    emit('selection-change', selectionList);
  }
  // function handleSizeChange(size: number) {
  //   innerPageSize.value = size;
  // }
  // function handlePrevClick(page: number) {
  //   emit('prev-click', page);
  // }
  // function handleNextClick(page: number) {
  //   emit('next-click', page);
  // }
  // function handleCurrentChange(page: number) {
  //   innerCurrentPage.value = page;
  // }

  return { curTableData, showDirectives, renderTable, renderTableColumns };
}

export default useTableCore;
