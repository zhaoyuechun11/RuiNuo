import axiosBase from '@utils/http';
//获取基本信息选中的子段
export function getSelectField(params) {
  return axiosBase('/apiweb/approve/selectBasicInfoField', 'get', params);
}
//添加基本信息字段
export function create(params) {
  return axiosBase('/apiweb/approve/addBasicInfoField', 'post', params);
}

export function dictList(params) {
  return axiosBase('/basic/dict/getList', 'get', params);
}
export function paramsSetList(params) {
  return axiosBase('/basic/parameter/page', 'get', params);
}
export function paramsSetAdd(params) {
  return axiosBase('/basic/parameter/add', 'post', params);
}
export function paramsSetUpdate(params) {
  return axiosBase('/basic/parameter/update', 'post', params);
}
export function paramsSetExport(params) {
  return axiosBase('/basic/parameter/export', 'get', params);
}
export function paramsSetDelete(params) {
  return axiosBase('/basic/parameter/delete', 'post', params);
}
export function mainEnterPage(params) {
  return axiosBase('sys/module/mainEnterPage', 'get', params);
}
export function mainEnterPageAdd(params) {
  return axiosBase('sys/module/addReqMainEnter', 'post', params);
}
export function mainEnterPageUpdate(params) {
  return axiosBase('sys/module/update', 'post', params);
}
export function mainEnterPageDele(params) {
  return axiosBase('sys/module/delete', 'post', params);
}
export function updateDefault(params) {
  return axiosBase('sys/module/updateMainEnterDefault', 'post', params);
}

