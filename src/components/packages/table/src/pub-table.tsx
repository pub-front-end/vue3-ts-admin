import { defineComponent, watch, watchEffect } from 'vue';
import props from './use-components/props-helper';
import useTableCore from './use-components/table-core-helper';
import Render from './utils/render';

export default defineComponent({
  name: 'pub-table',
  components: {
    Render
  },
  props,
  emits: [
    'update',
    'size-change',
    'pagination-change',
    'current-page-change',
    'set-sort-Table',
    'sort-change',
    'selection-change',
    'prev-click',
    'next-click'
  ],
  setup(props: any, { emit }) {
    let { innerCurrentPage, innerPageSize, innerTotal, paginationShow, curTableData, renderLayout } = useTableCore(
      props,
      emit
    );
    watch(
      () => props.data,
      (val) => {
        innerTotal.value = val.length;
      },
      {
        deep: true
      }
    );
    watchEffect(() => {
      if (paginationShow.value && innerTotal) {
        let ceilTotalPage = Math.ceil(innerTotal.value / innerPageSize.value);
        if (innerCurrentPage.value > ceilTotalPage) {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          innerCurrentPage.value = ceilTotalPage;
        }
        let from = innerPageSize.value * (innerCurrentPage.value - 1);
        let to = from + innerPageSize.value;
        curTableData = props.data.slice(from, to);
      } else {
        curTableData = props.data;
      }
    });

    return { curTableData, renderLayout };
  },
  render() {
    return <div>{this.renderLayout()}</div>;
  }
});
