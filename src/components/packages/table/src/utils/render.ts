export default {
  name: 'render',
  functional: true,
  props: {
    render: Function
  },
  render: (h: any, ctx: any) => {
    return ctx.props.render(h, ctx.data);
  }
};
