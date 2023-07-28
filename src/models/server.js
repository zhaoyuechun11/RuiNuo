import axiosBase from '@utils/http';

// 登录接口

// 部门树形列表

// 全局搜索候选人
export function userDetail(params) {
  return axiosBase('/sys/user/detail', 'get', params);
}
export function majorGroup(params) {
  return axiosBase('/basic/labClass/list', 'get', params);
}
export function manageListSelect(params) {
  return axiosBase('/basic/labClassManage/list', 'get', params);
}
export function reportUnitSelect(params) {
  return axiosBase('basic/reportUnit/getList', 'get', params);
}
