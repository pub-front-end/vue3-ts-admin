/**
 * http请求/相应拦截器
 */
import { EventBus } from '@/utils/event-bus';
import { debounce } from '@/utils/tools';
import axios from 'axios';
import Vue from 'vue';
import { getToken } from './storage';

const pending = []; // 声明一个数组用于存储每个ajax请求的取消函数和ajax标识
const removePending = (ever) => {
  for (let p in pending) {
    // url method 参数都不一致才取消请求
    if (
      pending[p].u === ever.url + '&' + ever.method &&
      JSON.stringify(pending[p].data) === JSON.stringify(ever.data) &&
      JSON.stringify(pending[p].params) === JSON.stringify(ever.params)
    ) {
      //当当前请求在数组中存在时执行函数体
      pending[p].f(); //执行取消操作
      pending.splice(p, 1); //把这条记录从数组中移除
    }
  }
};

const messageError = (message) => {
  Vue.prototype.$message.error(message);
};
// 防止多次Message错误信息
const debounceMessageError = debounce(messageError, 500);
const debounceLoginOut = debounce(() => {
  EventBus.$emit('login.login-out');
}, 500);
let CancelToken = axios.CancelToken;
/**
 * HTTP拦截器
 */
class UAxios {
  constructor() {
    this.baseURL = '';
    this.withCredentials = false; // 不携带凭证
    this.crossDomain = true; // 允许跨域
  }

  request(options, cancelToken = true) {
    // 每次请求都会创建新的axios实例。
    const instance = axios.create({
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
    // 将用户传过来的参数与公共配置合并
    const config = {
      baseURL: this.baseURL, //添加了分析中心请求ip地址
      withCredentials: this.withCredentials,
      crossDomain: this.crossDomain,
      ...options
    };
    // 配置拦截器，支持根据不同url配置不同的拦截器。
    this.setInterceptors(instance, cancelToken); // options.url
    // 返回axios实例的执行结果
    return instance(config);
  }

  setInterceptors(instance, cancelToken) {
    // 请求拦截器
    instance.interceptors.request.use(
      (config) => {
        // config.headers.contentType = 'application/json; charset=utf-8';
        if (config.method === 'get' || config.method === 'delete') {
          config.data = true;
        }
        // config.headers['Content-Type'] = 'application/json; charset=utf-8';
        // 每个请求都传递token
        config.headers.Authorization = getToken();
        config.responseType = config.responseType ? config.responseType : undefined;
        if (cancelToken) {
          removePending(config); //在一个ajax发送前执行一下取消操作
          config.cancelToken = new CancelToken((c) => {
            // url,port,params一致，则取消重复请求
            pending.push({
              u: config.url + '&' + config.method,
              f: c,
              data: config.data,
              params: config.params
            });
            return;
          });
        }
        return config;
      },
      (err) => {
        Vue.prototype.$message.error(err);
        Promise.reject(err);
      }
    );

    // 响应拦截器
    instance.interceptors.response.use(
      (response) => {
        // 拦截文件下载数据

        cancelToken && removePending(response.config); //请求结束后，移除本次请求
        const { code = '', message } = response.data;

        if (code === '' || code === null) {
          return response.data;
        } else {
          if (code === '100013') {
            debounceMessageError(message || '登录超时，请重新登录');
            debounceLoginOut();
          } else {
            debounceMessageError(message);
          }
          return Promise.reject(response.data);
        }
      },
      (err) => {
        if (axios.isCancel(err)) {
          return Promise.reject('重复的API请求');
        } else {
          if (err.response) {
            switch (err.response.status) {
              case 401:
                debounceMessageError('您没有访问当前接口的权限，请联系相关人员开通该权限或切换账号');
                debounceLoginOut();
                break;
              case 404:
                // 返回404 跳转到404页面 或者 跳转到登录页面
                debounceMessageError('您访问的接口不存在');
                break;
            }
          }
          return Promise.reject(err); // 返回接口返回的错误信息
        }
      }
    );
  }
}

let HttpServ = new UAxios();

export default HttpServ;
