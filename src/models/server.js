import axiosBase from '@utils/http';

// 登录接口


// 部门树形列表


// 全局搜索候选人
export function userDetail(params) {
  return axiosBase('/sys/user/detail', 'get', params);
}