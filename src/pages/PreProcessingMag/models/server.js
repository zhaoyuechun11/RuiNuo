import axiosBase from '@utils/http';

export function showCustomHeader(params) {
  return axiosBase('sys/assembly/mainEnterDataList', 'get', params);
}
export function saveCustomHeader(params) {
  return axiosBase('sys/assembly/updateListSeq', 'post', params);
}
export function mainEnterOperateList(params) {
  return axiosBase('sys/assembly/mainEnterOperateList', 'get', params);
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
export function reqMainOrderUpdate(params) {
  return axiosBase('lab/reqMainOrder/update', 'post', params);
}
export function reqMainOrderDelete(params) {
  return axiosBase('lab/reqMainOrder/delete', 'post', params);
}
export function reqMainOrderExport(params) {
  return axiosBase('lab/reqMainOrder/export', 'post', params);
}
export function getQueryData(params) {
  return axiosBase('sys/queryAssembly/reqMainEnterDetail', 'get', params);
}
export function saveCustomQuery(params) {
  return axiosBase('sys/queryAssembly/updateReqMainEnter', 'post', params);
}
export function getApplicationForm(params) {
  return axiosBase('lab/reqMainOrder/examinePage', 'get', params);
}
export function pageForReqMainEnter(params) {
  return axiosBase('basic/reqItem/pageForReqMainEnter', 'get', params);
}
export function reportItems(params) {
  return axiosBase('basic/reqItemLabItem/getListByReqItem', 'get', params);
}
export function userList(params) {
  return axiosBase('sys/user/list', 'get', params);
}
export function examineData(params) {
  return axiosBase('lab/reqMainOrder/examine', 'post', params);
}
export function examineDataCustomHeader(params) {
  return axiosBase('sys/assembly/mainExamineDataList', 'get', params);
}
