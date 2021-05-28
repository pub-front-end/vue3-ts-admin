import HttpService from '@/utils/http-service';
// 查询系统配置
export const getSysConfig = () =>
  HttpService.request({
    url: '/sysConfig',
    method: 'get'
  });

// 查询所有 用户
export const getUserList = (data: any) =>
  HttpService.request({
    url: '/user/pageInfo',
    method: 'get',
    params: data
  });
