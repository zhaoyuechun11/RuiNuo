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
export function getHospitalList(params) {
  return axiosBase('basic/hospital/getList', 'get', params);
}
export function dictList(params) {
  return axiosBase('/basic/dict/getList', 'get', params);
}
export function getDoctorList(params) {
  return axiosBase('basic/doctor/getList', 'get', params);
}
export function reportUnitList(params) {
  return axiosBase('basic/reportUnit/getList', 'get', params);
}
export function reportUnitReqItem(params) {
  return axiosBase('basic/reportUnitReqItem/getList', 'get', params);
}
export function reportUnitInstr(params) {
  return axiosBase('basic/reportUnitInstr/getList', 'get', params);
}
export function listByReportUnit(params) {
  return axiosBase('/sys/user/listByReportUnit', 'get', params);
}
export function reportProjectSele(params) {
  return axiosBase('/basic/labItem/getList', 'get', params);
}
export function getUserList(params) {
  return axiosBase('/sys/user/list', 'get', params);
}
export async function deptList(params) {
  return axiosBase(`/basic/dept/list`, 'get', params);
}
export async function getMainOrder(params) {
  return axiosBase(`/lab/reqMainOrder`, 'get', params);
}
export function getQueryData(params) {
  return axiosBase('sys/queryAssembly/reqMainEnterDetail', 'get', params);
}
export function saveCustomQuery(params) {
  return axiosBase('sys/queryAssembly/updateReqMainEnter', 'post', params);
}