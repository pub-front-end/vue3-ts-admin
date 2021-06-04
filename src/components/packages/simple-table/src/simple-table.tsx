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
    let { renderLayout, curTableData } = useRender(props, emit);
    watchEffect(() => {
      curTableData.value = props.data;
    });
    return { renderLayout };
  },
  render() {
    return this.renderLayout();
  }
});
