import axiosBase from '@utils/http';

// 登录接口
export function initDingData(params) {
  return axiosBase('/apiweb/ding/login', 'post', params);
}

// 部门树形列表
export function departmentListApi(params) {
  return axiosBase(`/apiweb/department/list`, 'get', params);
}

// 全局搜索候选人
export function globalSearch(params) {
  return axiosBase('/apiweb/user/globalSearch', 'get', params);
}