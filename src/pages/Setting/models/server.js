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
