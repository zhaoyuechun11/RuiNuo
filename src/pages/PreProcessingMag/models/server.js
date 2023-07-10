import axiosBase from '@utils/http';

export function showCustomHeader(params) {
  return axiosBase('sys/assembly/mainEnterDataList', 'get', params);
}
export function saveCustomHeader(params) {
  return axiosBase('sys/assembly/updateListSeq', 'post', params);
}
export function mainEnterOperateList(params) {
  return axiosBase('sys/assembly/mainEnterOperateList', 'post', params);
}
export function mainEnterEnterList(params) {
  return axiosBase('sys/assembly/mainEnterEnterList', 'get', params);
}
export function moduleList(params) {
  return axiosBase('sys/module/mainEnterList', 'get', params);
}
export function getArea(params) {
  return axiosBase('/basic/area/getAll', 'get', params);
}
export function getMainOrder(params) {
  return axiosBase('/lab/reqMainOrder', 'get', params);
}
export function getDictList(params) {
  return axiosBase('/basic/dict/getList', 'get', params);
}
export function getHospitalList(params) {
  return axiosBase('basic/hospital/getList', 'get', params);
}
export function getDoctorList(params) {
  return axiosBase('basic/doctor/getList', 'get', params);
}
export function enterAdd(params) {
  return axiosBase('lab/reqMainOrder/add', 'post', params);
}
export function reqMainOrder(params) {
  return axiosBase('lab/reqMainOrder/page', 'get', params);
}
export function majorGroup(params) {
  return axiosBase('/basic/labClass/list', 'get', params);
}