/* eslint-disable */
import Vue, { CreateElement, VNode } from 'vue';
interface IScope {
  $index: number;
  row: {
    [key: string]: any;
  };
  [key: string]: any;
}

declare module '*.tsx' {
  import Vue from 'compatible-vue';
 
  export default Vue
}

declare global {
 
  namespace JSX {
    interface Element extends VNode { }
    interface ElementClass extends Vue { }
    interface IntrinsicElements {
      [elem: string]: any
    }
  }
  // 公共具名空间，避免类型检查 重复引用
  namespace Pub {
    type CreateEl = CreateElement;
    type Scope = IScope;
  }
}

/* eslint-enable */
