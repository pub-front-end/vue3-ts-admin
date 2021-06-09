/**
 * 正则表达式
 */
import { debounce } from './tools';

interface IRule {
  password: RegExp;
  [key: string]: RegExp;
}

// 校验规则
let pattern: IRule = {
  // 密码
  password: /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{1,}/,
  // ip地址（非广播格式）
  ip: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-4])$/,
  // ip地址（组播地址）
  multiIp:
    /^(?:22[4-9]|23[0-9])\.(?:\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(?:\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(?:\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/,
  // 网关
  gateway:
    /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-4])$/,
  // 子网掩码
  netmask: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/,
  // 端口
  port: /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
  // 协议
  protocol: /^[A-Za-z0-9_-]{1,100}$/,
  // 手机
  phone: /(^(\+?\d{2,3}(\s|-))?(\d{3,4}(\s|-))?\d{7,8})$|^(\+?\d{2,3}(\s|-))?(1[3|5|7|8]\d{9})$/,
  // 邮箱
  email: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
  // 账号
  account: /^[a-zA-Z0-9\-\@\.\_]{2,16}$/,
  // 名称及其他输入框 \D |(l?x{0,3}|x[lc])(v?i{0,3}|i[vx])  M{0,9}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})
  text: /^[ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ\u4E00-\u9FA5A-Za-z0-9\s\-\@\.\。\,\，\;\；\?\？\/\_\—\(\)\（\）\[\]\《\》\#]+$/,
  // 名称及其他输入框-包含空格
  textSpace: /^[\u4E00-\u9FA5A-Za-z0-9\s\-\@\.\。\,\，\;\；\?\_\—\(\)\（\）\[\]\《\》]+$/,
  // 升级计划名称
  upgradePlanName: /^[\u4E00-\u9FA5A-Za-z0-9\-\.\_\—]+$/,
  // 文本域
  textarea: /^[\u4E00-\u9FA5A-Za-z0-9\s\-\#\%\&\@\、\【\】\!\！\.\。\,\，\;\；\?\？\/\_\—\(\)\（\）\[\]\《\》\#]+$/,
  // 区域
  area: /^[\u4E00-\u9FA5]{2,10}$/,
  // 经度
  longitude: /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d)\.\d{0,20})|(\d|[1-9]\d|1[0-7]\d)|180\.0{0,20}|180)$/,
  // 纬度
  latitude: /^(\-|\+)?([1-8]?\d{1}\.\d{0,20}|90\.0{0,20}|[1-8]?\d{1}|90)$/,
  // 英文字母和数字
  enAndNum: /^[a-zA-Z0-9]+$/,
  // 中文
  ch: /^[\u4e00-\u9fa5]{0,}$/,
  // 汉字，英文，数字和罗马数字
  chAndEnAndNum:
    /^[a-zA-Z0-9\u4e00-\u9fa5]|(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]|M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})+$/,
  // mac地址
  mac: /^(([A-Fa-f0-9]{2}:){2}|([A-Fa-f0-9]{2}:){5})[A-Fa-f0-9]{2}$/,
  // 区域编码
  code: /^[0-9]{6}$/,
  // 协议名
  protocolName: /^[A-Za-z0-9_-]{1,100}$/
};

// 判断是否是正则表达式
let isReg = (rule: any) => Object.prototype.toString.call(rule).slice(8, 14) === 'RegExp';

/**
 * 同步验证
 * @param ruleName 规则名称，字符串或正则表达式
 * @param message 验证失败的提示信息
 * @param trigger 触发验证方式
 */
export const validateSync = (ruleName: string | RegExp, message: string, trigger = 'change') => {
  let validator = (rule: any, value: string, callback: Fn) => {
    const reg: RegExp = isReg(ruleName) ? (ruleName as RegExp) : pattern[ruleName as string];
    if (reg && value && !reg.test(value)) {
      callback(new Error(message));
    } else {
      callback();
    }
  };
  return { validator, trigger };
};

/**
 * 异步校验--防抖
 * @param asyncApi 异步验证API
 * @param asyncCallBack 回调方法
 * @param sourceData 原数据  非必传
 * @param wait 防抖延迟时间  非必传
 * @param trigger 触发验证方式 非必传
 */
export const validateAsync = (
  asyncApi: any,
  asyncCallBack: Fn,
  sourceData: any = '',
  wait = 300,
  trigger = 'change'
) => {
  const debounceAsyncApi = debounce(async (value: string, callback: Fn) => {
    let { data } = await asyncApi(value);
    const msg = asyncCallBack(data);
    if (msg === '') {
      callback();
    } else {
      callback(new Error(msg));
    }
  }, wait);
  const validator = (rule: RegExp, value: string, callback: Fn) => {
    if (sourceData === '' || (value !== sourceData && sourceData !== '')) {
      debounceAsyncApi(value, callback);
    } else {
      callback();
    }
  };
  return { validator, trigger };
};

// 验证区域
export const area = () => {
  return validateSync('area', `请输入中文长度2到10位!`, 'change');
};
// 验证区域编码
export const code = (message = '区域编码') => {
  return validateSync('code', `请输入正确的${message}，如：100000`, 'change');
};
// 验证mac
export const mac = (message = 'mac地址') => {
  return validateSync('mac', `请输入正确的${message}，如：B4:4C:C2:14:00:A4`, 'change');
};
export const code1 = (asyncApi: Fn, sourceData?: any) => {
  return validateAsync(sourceData, asyncApi, (data: any) => {
    if (data.length > 0) {
      return '该区域编码已被占用，请重新填写';
    }
    return '';
  });
};
// 验证mac
export const mac1 = (asyncApi: Fn, sourceData?: any) => {
  return validateAsync(sourceData, asyncApi, (data: any) => {
    if (data) {
      return '该MAC已被使用，请重新填写';
    }
    return '';
  });
};

// 必选，非空
export const notEmpty = (message: string, trigger = 'change') => {
  return { required: true, message: `${message}不能为空`, trigger };
};

// 字符长度范围
export const lengthRange = (min: number, max: number, trigger = 'change') => {
  return { min, max, message: `字符长度应在${min}到${max}之间`, trigger };
};

// 最小字符长度
export const min = (min: number, trigger = 'change') => {
  return { min, message: `字符长度必须大于${min}个字符`, trigger };
};

// 最大字符长度
export const max = (max: number, trigger = 'change') => {
  return { max, message: `字符长度必须小于等于${max}个字符`, trigger };
};

// 验证密码
export const checkPassword = (message = '密码') => {
  return validateSync('password', `${message}中必须包含字母、数字、特殊字符`, 'change');
};

// 验证IP地址
export const checkIP = (message = 'ip地址') => {
  return validateSync('ip', `请输入正确的${message}，如：1.1.1.1`, 'change');
};

// 验证子网掩码
export const checkNetmask = (message = '子网掩码') => {
  return validateSync('netmask', `请输入正确的${message}`, 'change');
};

// 验证默认网关
export const checkGateWay = (message = '默认网关') => {
  return validateSync('gateway', `请输入正确的${message}`, 'change');
};

// 验证端口
export const checkPort = (message = '端口') => {
  return validateSync('port', `请输入正确的${message}`, 'change');
};
// 验证账户
export const account = (message = '账户') => {
  return validateSync('account', `${message}只能是英文，数字，@，.，_当中的字符，2到16位`, 'change');
};
// 验证一般输入框
export const text = (message = '') => {
  return validateSync('text', `${message}只能是中文、英文、数字、特殊字符（@、.。,，；;-_—/()[]《》#）`, 'change');
};
// 验证升级计划名称
export const upgradePlanName = (message = '') => {
  return validateSync('upgradePlanName', `${message}只能是中文、英文、数字、特殊字符_.-`, 'change');
};
//
// 验证一般输入框-含空格
export const textSpace = (message = '') => {
  return validateSync('textSpace', `${message}只能是中文、英文、数字、特殊字符（@.。,，；;-_—()[]《》`, 'change');
};
// 验证文本域
export const textarea = (message = '') => {
  return validateSync(
    'textarea',
    `${message}只能是中文、英文、数字、特殊字符（!%&?@.。,，；;-_—/()[]《》【】？！#）`,
    'change'
  );
};
// 验证邮箱
export const email = (message = '邮箱') => {
  return validateSync('email', `请输入正确的${message}格式，如：123@xx.com`, 'change');
};

// 验证电话
export const phone = (message = '电话') => {
  return validateSync('phone', `请输入正确的${message}格式`, 'change');
};

// 验证经度
export const longitude = (message = '经度') => {
  return validateSync('longitude', `请输入正确的${message}格式`, 'change');
};

// 验证纬度
export const latitude = (message = '纬度') => {
  return validateSync('latitude', `请输入正确的${message}格式`, 'change');
};

// 验证协议名
export const protocolName = (message = '协议名') => {
  return validateSync('protocolName', `请输入正确的${message}格式`, 'change');
};

export default {
  pattern,
  email,
  text,
  textSpace,
  textarea,
  upgradePlanName,
  account,
  phone,
  longitude,
  latitude,
  required: notEmpty,
  ip: checkIP,
  port: checkPort,
  password: checkPassword,
  netmask: checkNetmask,
  gateWay: checkGateWay,
  mac,
  code,
  area,
  protocolName
};
