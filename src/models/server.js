import axiosBase from '@utils/http';
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
