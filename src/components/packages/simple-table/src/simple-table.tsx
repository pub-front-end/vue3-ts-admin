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
    let { renderTable, curTableData } = useRender(props, emit);
    watchEffect(() => {
      curTableData.value = props.data;
    });
    return { renderTable, curTableData };
  },
  render() {
    console.log(`new Date()`, new Date());
    return <div>{this.renderTable()}</div>;
  }
});
