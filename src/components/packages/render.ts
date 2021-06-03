import { defineComponent } from 'vue';
export default defineComponent({
  name: 'render',
  functional: true,
  props: {
    render: Function,
    scope: Object
  },
  render(vm: any) {
    return vm.render(vm.scope);
  }
});
