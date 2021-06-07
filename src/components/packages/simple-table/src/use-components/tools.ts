const hasOwnProperty = Object.prototype.hasOwnProperty;

function hasOwn(obj: any, key: PropertyKey) {
  return hasOwnProperty.call(obj, key);
}

export const delegate = function (dom: { [x: string]: any }, properties: any[]) {
  properties.forEach((p: string | number) => {
    if (!hasOwn(dom, p)) return;
    if (!dom[p]) return;
    if (this[p]) return;
    if (typeof dom[p] === 'function') {
      this[p] = function (...arg: any) {
        dom[p](...arg);
      };
    } else {
      this[p] = dom[p];
    }
  });
};
/**
 * @desc 函数防抖
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param immediate true 表立即执行，false 表非立即执行
 */
export function debounce(
  func: { apply: (arg0: any, arg1: IArguments) => void },
  wait: number | undefined,
  immediate: any
) {
  let timeout: NodeJS.Timeout | null;

  return function (args?: any) {
    if (timeout) clearTimeout(timeout);
    if (immediate) {
      let callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, wait);
      if (callNow) func.apply(this, args);
    } else {
      timeout = setTimeout(function () {
        func.apply(this, args);
      }, wait);
    }
  };
}
/**
 * @copyright L.Dragon
 * @description 深度克隆
 * @param origin 被克隆对象
 * @param target 获得copy
 * @returns {object}
 */
// TODO 类型改为object 要报错
export const deepClone = (origin: { [x: string]: any }, target: { [x: string]: any }) => {
  for (let key in origin) {
    // 遍历原对象
    if (Object.prototype.hasOwnProperty.call(origin, key)) {
      // 如果是数组
      if (Array.isArray(origin[key])) {
        target[key] = [];
        deepClone(origin[key], target[key]); // 递归
      } else if (typeof origin[key] === 'object' && origin[key] !== null) {
        target[key] = {};
        deepClone(origin[key], target[key]); // 递归
      } else {
        target[key] = origin[key];
      }
    }
  }
  return target;
};
/**
 * 获取文本px宽度
 * @param string{String}:文本内容
 * @param font{String}: 字体样式
 **/
export const stringPxWidth = (string: string, font = '1rem Avenir,Helvetica,Arial,sans-serif') => {
  let canvas = document.createElement('canvas'),
    context = canvas.getContext('2d');
  if (!context) return 0;
  context.font = font;
  let metrics = context.measureText(string);
  return metrics.width;
};

export const getCell = function (event: { target: any }) {
  let cell = event.target;

  while (cell && cell.tagName.toUpperCase() !== 'HTML') {
    if (cell.tagName.toUpperCase() === 'TD') {
      return cell;
    }
    cell = cell.parentNode;
  }

  return null;
};
