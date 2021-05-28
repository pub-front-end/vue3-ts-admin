import { VueConstructor } from 'vue';

export type TType =
  | 'title'
  | 'render'
  | 'input'
  | 'inputNumber'
  | 'select'
  | 'cascader'
  | 'datePicker'
  | 'detail'
  | 'seperator'
  | 'text'
  | 'stationSelect';
export type TSize = 2 | 3 | 4 | 6 | 8 | 12 | 16 | 24;
export interface IPubValue {
  mapKey: string | boolean; // "0" key
  valueCn: string; // "合法" 中文值
  valueEn?: string; // "test" 英文值
  id?: string;
  description?: string; //"接入热点的设备的合法性标志" 描述
  type?: string; //类型
  disabled?: boolean; //是否禁用
  [key: string]: any;
}

export interface IDetailItem {
  label: string; // 名称|标题
  prop: string; // 属性字段
  type?: TType; // item类型 title:表示显示标题 ；undefined:显示详情值
  size?: TSize; // 一行显示几个
  isShowTip?: boolean; // 是否提示
  show?: boolean; // 是否显示当前选项
  isCopy?: boolean; // 是否可复制
  render?(h: Pub.CreateEl, data: any): any; // 自定义渲染方法
}
export interface IRenderItem {
  label: string; // 名称 标题
  prop: string; // 属性字段
  type?: TType; // item类型
  ref?: string; // 配置ref
  data?: IPubValue[] | string; //
  size?: TSize; //长度
  isShowTip?: boolean; // 是否提示
  dataProps?: any; //配置选项  value | label | children | disabled 指定选项的禁用为选项对象的某个属性值
  subType?: string | undefined; //子类型
  pickerOptions?: any; // 自定义时间快捷选择按钮
  disabled?: boolean; //禁用项
  attrs?: any; //参数项
  placeholder?: string; // 输入框占位文本
  rules?: any[]; // 表单验证规则
  show?: boolean; // 是否显示当前选项
  isTip?: boolean; // 是否显示详情提示
  optionKeyMap?: {
    [key: string]: string;
  };
  textarea?: boolean;
  maxlength?: string;
  valueKey?: any; //使用其他的key值
  defaultValue?: any;
  showPassword?: boolean; // 输入框 密码
  isCopy?: boolean; // 是否可复制
  isclearable?: boolean; //是否可清空
  render?(h: Pub.CreateEl, data: any): any; // 自定义渲染方法
  callback?(data: any): any; //自定义调用方法
}

export interface IButtonItem {
  oper: () => Fn; // 点击按钮执行的方法
  defaultName?: string; // 默认按钮名称 不写表示没有名称；如：查看、编辑、删除直接使用图标
  name?: string; // 按钮显示名称 不写表示没有名称；如：查看、编辑、删除直接使用图标
  permission?: string; // 按钮权限，不写表示直接显示；如：查看
  type?: string; // button类型
  icon?: string; // button图标 一般只有查看、编辑、删除才有
  sort?: number | undefined; // 排序序号0-9
  disabled?: boolean; // 按钮状态
  disabledMsg?: string; // 按钮状态提示信息
  popconfirm?: boolean; // 是否二次提示；如：删除
  popTitle?: string; // 二次提示的内容
  class?: string; // 按钮class
  reconfirm?: boolean; // 删除是否三次确认
  reconfirmLabel?: string; // 三次确认文本提示
}
declare global {
  interface IPubRenderEditor extends VueConstructor {
    validate(): any;
    resetFields(): any;
    clearValidate(): any;
  }
}
