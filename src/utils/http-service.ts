/**
 * http请求/相应拦截器
 */
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus';
import qs from 'qs';

const pending: any[] = []; // 声明一个数组用于存储每个ajax请求的取消函数和ajax标识
const removePending = (ever: any) => {
  for (let p in pending) {
    // url method 参数都不一致才取消请求
    if (
      pending[p].u === ever.url + '&' + ever.method &&
      JSON.stringify(pending[p].data) === JSON.stringify(ever.data) &&
      JSON.stringify(pending[p].params) === JSON.stringify(ever.params)
    ) {
      //当当前请求在数组中存在时执行函数体
      pending[p].f(); //执行取消操作
      pending.splice(p as any, 1); //把这条记录从数组中移除
    }
  }
};

const messageError = (message: any) => {
  ElMessage.error(message);
};

let CancelToken = axios.CancelToken;

// tokenType类型
// tokenType : isLogin(登录为formData提交且token为特殊值), formData(formData提交), noneToken(不需要token) default(默认登录后返回token)
type TokenType = 'default' | 'isLogin' | 'formData' | 'noneToken';

/**
 * HTTP拦截器
 */
class UAxios {
  public baseURL: string;
  public timeOut: number;
  public withCredentials: boolean;
  public crossDomain: boolean;

  public constructor() {
    this.baseURL = '';
    this.timeOut = 5000;
    this.withCredentials = false; // 不携带凭证
    this.crossDomain = true; // 允许跨域
  }

  public request(options: AxiosRequestConfig, cancelToken = true, tokenType: TokenType = 'default') {
    // 每次请求都会创建新的axios实例。
    const instance: AxiosInstance = axios.create({
      headers: {
        // 'Content-Type': 'application/json; charset=utf-8'
        'Content-Type':
          tokenType === 'formData' || tokenType === 'isLogin'
            ? 'application/x-www-form-urlencoded'
            : 'application/json; charset=utf-8'
      }
    });
    // 将用户传过来的参数与公共配置合并
    const config = {
      baseURL: this.baseURL, //添加了分析中心请求ip地址
      timeOut: this.timeOut,
      withCredentials: this.withCredentials,
      crossDomain: this.crossDomain,
      ...options
    };
    // 配置拦截器，支持根据不同url配置不同的拦截器。
    this.setInterceptors(instance, cancelToken, tokenType); // options.url
    // 返回axios实例的执行结果
    return instance(config);
  }

  private setInterceptors(instance: AxiosInstance, cancelToken: boolean, tokenType: TokenType) {
    // 请求拦截器
    instance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        if (config.method === 'get' || config.method === 'delete') {
          config.data = true;
        }
        // config.headers['Content-Type'] = 'application/json; charset=utf-8';
        // 每个请求都传递token
        config.responseType = config.responseType ? config.responseType : undefined;
        if (tokenType === 'formData' || tokenType === 'isLogin') {
          config.data = qs.stringify(config.data);
        }
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
      (err: AxiosError) => {
        messageError(err);
        Promise.reject(err);
      }
    );

    // 响应拦截器
    instance.interceptors.response.use(
      (response: AxiosResponse<any>) => {
        cancelToken && removePending(response.config); //请求结束后，移除本次请求
        const { code = '', message } = response.data;

        if (code === '' || code === null) {
          return response.data;
        } else {
          messageError(message);
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
                messageError('您没有访问当前接口的权限，请联系相关人员开通该权限或切换账号');
              case 404:
                // 返回404 跳转到404页面 或者 跳转到登录页面
                messageError('您访问的接口不存在');
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
