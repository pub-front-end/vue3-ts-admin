import { computed, defineComponent } from 'vue';
import { ItableProps } from './use-components/props-helper';
import useTableCore from './use-components/table-core-helper';

export default defineComponent({
  name: 'pub-table',
  setup(props: ItableProps, { emit }) {
    const innerTotal = computed(() => {
      return props.data.length;
    });
    const { innerCurrentPage, innerPageSize } = useTableCore(props, emit);

    const layouts = computed(() => props.layout.split(',').map((item: string) => item.trim()));
    const paginationShow = computed(() => layouts.value.includes('pagination'));
    const curTableData = computed(() => {
      if (paginationShow.value && innerTotal) {
        let ceilTotalPage = Math.ceil(innerTotal.value / innerPageSize.value);
        if (innerCurrentPage.value > ceilTotalPage) {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          innerCurrentPage.value = ceilTotalPage;
        }
        let from = innerPageSize.value * (innerCurrentPage.value - 1);
        let to = from + innerPageSize.value;
        return props.data.slice(from, to);
      } else {
        return props.data;
      }
    });

    return { curTableData };
  },
  render() {
    return <div></div>;
  }
});
