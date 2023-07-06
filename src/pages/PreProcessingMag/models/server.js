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
