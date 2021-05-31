import Axios from 'axios';
import Table from './mixins/table';
import { debounce } from './utils/tools';

export default {
  name: 'PubAsyncTable',
  mixins: [Table],
  props: {
    // 总数，一般不用传
    total: {
      type: Number
    },

    httpRequest: {
      type: [Function, Object]
    },
    // 接口输出映射关系
    propsMap: {
      type: Object,
      default: () => ({
        data: 'list',
        total: 'total',
        pageSize: 'pageSize',
        currentPage: 'pageNum'
      })
    },
    // 接口输入映射关系
    propsQueryMap: {
      type: Object,
      default: () => ({
        pageSize: 'pageSize',
        currentPage: 'pageNum'
      })
    },
    // 查询参数
    params: {
      type: Object,
      default: () => {
        return {};
      }
    },
    //需要修改的ip地址
    replaceUrl: {
      type: String,
      default: ''
    },
    // 如果需要封装一层传给后端的接口数据，传一个名称如：queryStr
    DTOName: {
      type: String,
      default: ''
    },
    transformResult: {
      type: Function,
      default: (result) => {
        return result;
      }
    },
    showLoading: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      tableType: 'async-table',
      curTableData: [],
      innerTotal: 0,
      searchParams: null, // 查询参数 doRequest传过来的
      sortParams: {
        sortColumn: undefined,
        sortFlag: undefined
      }
    };
  },
  created() {
    this.showDirectives = true; // 显示loading指令
    // 避免发起重复请求
    // 当pageSize变化，并且引起currentPage变化时，可以避免重复发起请求 防抖
    this.handleHttpRequest = debounce(this.handleHttpRequest, 100);

    if (this.httpRequest) {
      this.handleHttpRequest();
    }
  },
  methods: {
    _httpRequest({ pageSize, currentPage, ...other }) {
      let queryInfo = {
        ...this.searchParams,
        ...this.params,
        ...other,
        [this.propsQueryMap.pageSize]: other[this.propsMap.pageSize] || pageSize,
        [this.propsQueryMap.currentPage]: other[this.propsMap.currentPage] || currentPage
      };
      // 删除判断条件
      delete queryInfo.currentPage;

      // 多判断一下，兼容queryStr模式
      let params = {};
      if (this.DTOName && this.DTOName !== '') {
        params[this.DTOName] = JSON.stringify(queryInfo);
      } else {
        params = queryInfo;
      }

      // httpRequest 是API方法,则直接调用
      if (typeof this.httpRequest === 'function') return this.httpRequest(params, this.replaceUrl);

      const options = { method: 'get', ...this.httpRequest };
      if (options.method === 'get') {
        options.params = { ...(options.params || {}), ...params };
      } else {
        options.data = { ...(options.data || {}), ...params };
      }

      return Axios(options).then((res) => {
        if (res.status === 200) return res.data;
      });
    },
    /**
     * 异步接口请求表格数据
     * @param {pageSize} 一页显示数目
     * @param {currentPage} 当前页
     * @param {other} 其他查询条件 主要包括查询条件
     */
    handleHttpRequest({ pageSize, currentPage, ...other } = {}) {
      this.innerLoading = this.showLoading; //去掉loading状态 太晃眼睛了……
      const payload = {
        ...other,
        pageSize: pageSize || this.innerPageSize,
        currentPage: currentPage || this.innerCurrentPage
      };
      this.innerCurrentPage = payload.currentPage;
      Promise.resolve(this._httpRequest(payload))
        .then(({ data }) => {
          const result = this.transformResult(data);
          this.innerLoading = false;
          if (Array.isArray(result)) {
            this.curTableData = result;
            this.innerPageSize = 10;
            this.innerCurrentPage = 1;
            this.innerTotal = this.curTableData.length;
          } else {
            this.curTableData = result[this.propsMap.data] || [];
            this.innerPageSize = parseInt(result[this.propsMap.pageSize] || this.innerPageSize, 0);
            this.innerCurrentPage = parseInt(result[this.propsMap.currentPage] || this.innerCurrentPage, 0);
            this.innerTotal = parseInt(result[this.propsMap.total] || this.curTableData.length, 0);
            // 当前页如果没有数据，则跳转到上一页
            if (this.curTableData.length === 0 && this.innerCurrentPage > 1) {
              this.handleHttpRequest({ currentPage: 1 });
            }
          }
          this.$emit('data-change', {
            [this.propsMap.data]: this.curTableData,
            [this.propsMap.pageSize]: this.innerPageSize,
            [this.propsMap.currentPage]: this.innerCurrentPage,
            [this.propsMap.total]: this.innerTotal
          });
        })
        .catch(() => {
          this.innerLoading = false;
        });
    },
    /**
     * @public
     */
    doRequest(searchParams) {
      this.$emit('exportParams', searchParams);
      this.searchParams = Object.assign(searchParams, this.sortParams);
      // 主动调用 默认回到第一页
      this.handleHttpRequest({
        currentPage: searchParams[this.propsQueryMap.currentPage] || searchParams.currentPage
      });
    },
    /**
     * @override
     */
    handleSizeChange(size) {
      if (this.httpRequest) {
        this.handleHttpRequest({ pageSize: size });
      }
      this.innerPageSize = size;
    },
    /**
     * @override
     */
    handleCurrentChange(page) {
      if (this.httpRequest) {
        this.handleHttpRequest({ currentPage: page });
      }
      this.innerCurrentPage = page;
    },
    /**
     * 排序
     */
    handleSortChange(column) {
      if (this.httpRequest) {
        this.sortParams.sortColumn = column.order ? column.prop.replace(new RegExp(/CN/gm), '') : undefined;
        this.sortParams.sortFlag = column.order ? (column.order === 'ascending' ? '0' : '1') : undefined;
        this.searchParams = Object.assign({}, this.searchParams, this.sortParams);
        this.handleHttpRequest();
      }
    },
    /**
     * 清空数据
     */
    clearData() {
      this.curTableData = [];
      this.innerCurrentPage = 1;
      this.innerTotal = 0;
      this.handleSelectionChange([]);
    }
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler(val) {
        this.curTableData = val;
      }
    },
    total: {
      immediate: true,
      handler(val) {
        let totalPage = val / this.innerPageSize;
        let ceilTotalPage = Math.ceil(totalPage);
        if (ceilTotalPage >= this.innerCurrentPage) {
          this.innerTotal = val;
        } else {
          const curTotal = this.innerPageSize * this.innerCurrentPage;
          // console.warn(
          //   `[pub-table]: total ${val} less than ${curTotal} (pageSize*currentPage, ${this.innerPageSize}*${this.innerCurrentPage}), set total to ${curTotal}`
          // );
          this.innerTotal = curTotal;
        }
      }
    }
  }
};
