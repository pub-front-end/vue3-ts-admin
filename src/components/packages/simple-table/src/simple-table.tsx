import { defineComponent, watchEffect } from 'vue';
import props from './use-components/props-helper';
import Render from './use-components/render';
import useRender from './use-components/render-helper';

export default defineComponent({
  name: 'simple-table',
  components: {
    Render
  },
  props,
  setup(props: any, { emit }) {
    let {
      renderLayout,
      curTableData,
      paginationShow,
      innerCurrentPage,
      innerPageSize,
      innerTotal,
      handleSelectionChange
    } = useRender(props, emit);

    watchEffect(() => {
      innerTotal.value = props.data.length;

      if (paginationShow.value && innerTotal.value) {
        let ceilTotalPage = Math.ceil(innerTotal.value / innerPageSize.value);
        if (innerCurrentPage.value > ceilTotalPage) {
          // console.warn(
          //   `[pub-table]: currentPage ${this.currentPage} beyond total page ${ceilTotalPage} (data.length/pageSize,${this.innerTotal}/${this.innerPageSize}), set currentPage to totalPage: ${ceilTotalPage}`
          // );
          innerCurrentPage.value = ceilTotalPage;
        }
        let from = innerPageSize.value * (innerCurrentPage.value - 1);
        let to = from + innerPageSize.value;
        curTableData.value = props.data.slice(from, to);
      } else {
        curTableData.value = props.data;
      }
    });

    return { renderLayout, handleSelectionChange };
  },
  render() {
    return this.renderLayout();
  }
});
