function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

// 将origin复制到target
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const deepClone = (origin, target) => {
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
export function debounce(func, wait, immediate) {
  let timeout;

  return function (...params) {
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
export const throttle = function (func, delay) {
  let timer;
  return function () {
    let context = this;
    let args = arguments;
    if (!timer) {
      timer = setTimeout(function () {
        func.apply(context, args);
        clearTimeout(timer);
      }, delay);
    }
  };
};
export default {};
