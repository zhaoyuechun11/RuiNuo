// @ts-ignore
import axiosBase from '@utils/http';

export function addField(params) {
  return axiosBase('sys/assembly/addMainEnter', 'post', params);
}

export function updateField(params) {
  return axiosBase('sys/assembly/update', 'post', params);
}
export function updateFieldDisplay(params) {
  return axiosBase('sys/assembly/updateListDisplay', 'post', params);
}
export function fieldDelete(params) {
  return axiosBase('sys/assembly/delete', 'post', params);
}

export function patchStructureMove(params) {
  return axiosBase('sys/assembly/updateListSeq', 'post', params);
}
export function mainEnterOperateList(params) {
  return axiosBase('sys/assembly/mainEnterOperateList', 'get', params);
}
export function getArea(params) {
  return axiosBase('/basic/area/getAll', 'get', params);
}
export function moveField(params) {
  return axiosBase('sys/assembly/updateSeq', 'post', params);
}
export function displayOrRequired(params) {
  return axiosBase('sys/assembly/updateDisplay', 'post', params);
}
export function reportDataDetailOperateList(params) {
  return axiosBase('sys/assembly/reportMainDataDetailOperateList', 'get', params);
}
export function reportLis(params) {
  return axiosBase('sys/assembly/reportMainDataListOperateList', 'get', params);
}
