/* eslint-disable */
import { IButtonItem, IDetailItem, IRenderItem } from '@/components/packages/render/render';
import Vue, { VNode } from 'vue';
export  interface IScope {
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
    type Scope = IScope;
    type RenderItem = IRenderItem;
    type DetailItem = IDetailItem;
    type ButtonItem = IButtonItem;
  }
}

/* eslint-enable */
