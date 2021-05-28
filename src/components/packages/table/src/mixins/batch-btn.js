export default {
  props: {
    batchBtnSize: { type: Number, default: 8 },
    isBatchDel: { type: Boolean, default: false },
    isBatchExport: { type: Boolean, default: false },
    batchExportApi: { type: Boolean, default: false },
    batchDelApi: { type: Boolean, default: false }
  },
  data() {
    return {};
  },
  methods: {
    handleExport() {
      console.warn('还没有处理导出逻辑');
    },
    handleDel() {
      console.warn('还没有处理批量删除逻辑');
    },
    renderBatchBtn() {
      return (
        <div class="batch-btn-container">
          {this.isBatchExport ? (
            <el-button type="primary" on-click={this.handleExport}>
              导出
            </el-button>
          ) : null}
          {this.isBatchDel ? (
            <el-button type="danger" on-click={this.handleDel}>
              批量删除
            </el-button>
          ) : null}
          {this.$slots.batchBtn}
        </div>
      );
    }
  }
};
