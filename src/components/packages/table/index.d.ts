import { VueConstructor } from 'vue';

/**
 * 一个基于 vue 的 PC 端表格组件，支持增删改查等...
 */
export declare const PubTable: VueConstructor;
export declare const PubAsyncTable: IPubAsyncTable;
export declare const PubCustomTable: IPubAsyncTable;

declare global {
  interface IPubAsyncTable extends VueConstructor {
    doRequest(params: Record<string, any>): void;
    selectionList: any[];
  }
}

export default PubAsyncTable;
