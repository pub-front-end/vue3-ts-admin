import { ElMessage } from 'element-plus';
import PinyinEngine from './pinyin-match-engine/index';

function hasOwn(obj: any, key: PropertyKey) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

// 将origin复制到target
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const deepClone = (origin: { [x: string]: any }, target: { [x: string]: any }) => {
  for (let key in origin) {
    // 遍历原对象
    if (hasOwn(origin, key)) {
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
 * @desc 函数防抖
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param immediate true 表立即执行，false 表非立即执行
 */
export function debounce(
  func: { apply: (arg0: any, arg1: any[]) => void },
  wait: number | undefined,
  immediate: any = false
) {
  let timeout: NodeJS.Timeout;

  return function (...params: any) {
    let args = params;
    if (timeout) clearTimeout(timeout);
    if (immediate) {
      let callNow = !timeout;
      timeout = setTimeout(() => {
        clearTimeout(timeout);
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
 * @desc 函数节流
 * @param func throttle
 * @param delay 延迟执行毫秒数，默认 1000ms
 */
export const throttle = function (func: { apply: (arg0: any, arg1: IArguments) => void }, delay: number | undefined) {
  let timer: NodeJS.Timeout;
  return function (...params: any) {
    let context = this;
    let args = params;
    if (!timer) {
      timer = setTimeout(function () {
        func.apply(context, args);
        clearTimeout(timer);
      }, delay);
    }
  };
};

export function pinyinQuery(list: any, query: string, name: string) {
  const pinyinEngine = new PinyinEngine(list, [name]);
  pinyinEngine.query(query);
  return pinyinEngine.query(query);
}
/**
 *  树转换数组
 * @param data //tree数据
 * @param subitems //子节点名称
 */
export function tree2Array(array: any, subitems?: string) {
  if (array && array.length) {
    return [].concat(...array.map((item: any) => [].concat(item, ...tree2Array(item[subitems || 'children']))));
  }
  return [];
}
/**
 * @desc 提示表单验证的首个错误信息
 * @param obj 错误信息对象{}
 */
export function messageFirstError(errObj: any) {
  let keys = Object.keys(errObj);
  if (keys.length) {
    ElMessage.error(errObj[keys[0]] && errObj[keys[0]].length && errObj[keys[0]][0].message);
  }
}
// 根据prop获取object上的属性，支持 obj.name.test
export const getValueByPath = function (object: Record<string, any>, prop: string) {
  prop = prop || '';
  const paths = prop.split('.');
  let current = object;
  let result = null;
  for (let i = 0, j = paths.length; i < j; i++) {
    const path = paths[i];
    if (!current) current = {};

    if (i === j - 1) {
      result = current[path];
      break;
    }
    current = current[path];
  }
  return result;
};

export default {};
