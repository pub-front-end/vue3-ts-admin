// import BatchBtn from './batch-btn';
// import ColumnFilter from './column-filter';
import { computed, getCurrentInstance, onBeforeMount, reactive, ref, watch } from 'vue';
import '../style/index.scss';
import useColumnFilter from './column-filter-helper';
import { ItableProps } from './props-helper';

const DefaultPaginationProps = {
  pageSizes: [15, 30, 50, 100],
  layout: '->, total, sizes, prev, pager, next, jumper'
};

function useTableCore(
  props: ItableProps,
  emit: ((event: string, ...args: any[]) => void) | ((event: string, ...args: any[]) => void)
) {
  const { innerColumns } = useColumnFilter(props);
  let vm: any;
  let tableClientWidth = ref(100); //表格宽度
  let innerLoading = ref(false);
  let innerCurrentPage = ref(1);
  let innerPageSize = ref(10);
  let innerPaginationProps = reactive(DefaultPaginationProps);
  let sortable = reactive({}); // 拖拽table对象
  let sortableData = reactive([]);
  let showDirectives = ref(false); // 异步请求使用loading指令
  let selectionList = reactive([]); // 选中数组
  const pubTable = computed(() => vm.$refs.pubTable || {});
  const layouts = computed(() => props.layout.split(',').map((item: string) => item.trim()));
  const paginationShow = computed(() => layouts.value.includes('pagination'));
  const toolBarShow = computed(() => layouts.value.includes('tool') && vm.$slots.tool);

  const innerTableColumns = computed(() => {
    // 第一次初始值不进行什么操作
    if (tableClientWidth.value === 100) return innerColumns;
    let index = innerColumns.value.findIndex((col: any) => !col.width);
    if (index === -1) {
      vm.$nextTick(() => {
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
      vm.$nextTick(() => {
        vm.$forceUpdate();
      });
    },
    {
      immediate: true
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
      vm.$nextTick(() => {
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
      vm.$nextTick(() => {
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

  return {
    pubTable,
    layouts,
    paginationShow,
    toolBarShow,
    tableClientWidth,
    innerLoading,
    innerCurrentPage,
    innerPageSize,
    innerPaginationProps,
    sortable,
    sortableData,
    showDirectives,
    selectionList,
    innerTableColumns
  };
}

export default useTableCore;
