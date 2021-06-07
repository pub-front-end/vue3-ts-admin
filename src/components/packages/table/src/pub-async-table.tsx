import { ElMessage } from 'element-plus';
import { defineComponent, watchEffect } from 'vue';
import props from './use-components/props-helper';
import Render from './use-components/render';
import useRender from './use-components/render-helper';
import { debounce } from './use-components/tools';

export default defineComponent({
  name: 'simple-async-table',
  components: {
    Render
  },
  props,
  setup(props: any, { emit }) {
    let {
      renderLayout,
      curTableData,
      innerCurrentPage,
      innerPageSize,
      innerTotal,
      innerLoading,
      innerPaginationProps,
      handleSelectionChange
    } = useRender(props, emit);
    // 避免发起重复请求 当pageSize变化，并且引起currentPage变化时，可以避免重复发起请求 防抖
    const debounceHandleHttpRequest = debounce(handleHttpRequest, 100, false);
    let searchParams: any = {}; //查询参数
    let sortParams: any = {}; //排序参数
    if (props.httpRequest) {
      debounceHandleHttpRequest();
    }
    function _httpRequest(payload: any) {
      // httpRequest 是API方法,则直接调用
      if (typeof props.httpRequest === 'function') return props.httpRequest(payload);
      else {
        // 不是方法再补充
        ElMessage.warning('httpRequest应该是方法！');
      }
    }
    /**
     * 异步接口请求表格数据
     * @param {pageSize} 一页显示数目
     * @param {currentPage} 当前页
     * @param {other} 其他查询条件 主要包括查询条件
     */
    function handleHttpRequest({ pageSize, currentPage, ...other }: any = {}) {
      innerLoading.value = true;
      const payload = {
        ...searchParams,
        ...other,
        [props.propsQueryMap.pageSize]: pageSize || innerPageSize.value,
        [props.propsQueryMap.currentPage]: currentPage || innerCurrentPage.value || 1
      };
      innerCurrentPage.value = payload[props.propsQueryMap.currentPage];
      Promise.resolve(_httpRequest(payload))
        .then(({ data }) => {
          console.log(`data`, data);
          const result = props.transformResult(data);
          innerLoading.value = false;
          if (Array.isArray(result)) {
            curTableData.value = result;
            innerPageSize.value = payload[props.propsQueryMap.pageSize] || innerPaginationProps.value.pageSizes[0];
            innerCurrentPage.value = payload[props.propsQueryMap.currentPage] || 1;
            innerTotal.value = result.length;
          } else {
            curTableData.value = result[props.propsMap.data] || [];
            innerPageSize.value = parseInt(
              result[props.propsMap.pageSize] || innerPageSize.value || innerPaginationProps.value.pageSizes[0],
              10
            );
            innerCurrentPage.value = parseInt(result[props.propsMap.currentPage] || innerCurrentPage.value || 1, 10);
            innerTotal.value = parseInt(result[props.propsMap.total] || curTableData.value.length, 10);
            // 当前页如果没有数据，则跳转到上一页
            if (curTableData.value.length === 0 && innerCurrentPage.value > 1) {
              debounceHandleHttpRequest({ currentPage: 1 });
            }
          }
          emit('data-change', {
            [props.propsMap.data]: curTableData.value,
            [props.propsMap.pageSize]: innerPageSize.value,
            [props.propsMap.currentPage]: innerCurrentPage.value,
            [props.propsMap.total]: innerTotal.value
          });
        })
        .catch(() => {
          innerLoading.value = false;
        });
    }

    function doRequest(searchParams: any) {
      emit('exportParams', searchParams);
      searchParams = Object.assign(searchParams, sortParams);
      // 主动调用 默认回到第一页
      debounceHandleHttpRequest({
        currentPage: searchParams[props.propsQueryMap.currentPage] || searchParams.currentPage
      });
    }
    watchEffect(() => {
      if (typeof props.httpRequest === 'function') {
        console.log(`innerCurrentPage.value`, innerCurrentPage.value, innerPageSize.value);
        debounceHandleHttpRequest({
          currentPage: innerCurrentPage.value,
          pageSize: innerPageSize.value
        });
      }
    });

    return { renderLayout, handleSelectionChange, doRequest };
  },
  render() {
    return this.renderLayout();
  }
});
