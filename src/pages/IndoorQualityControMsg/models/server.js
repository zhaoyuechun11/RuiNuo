import axiosBase from '@utils/http';
export function getInstrByLabClassName(params) {
  return axiosBase('/basic/instr/getListForLabClassIdName', 'get', params);
}
export function getListForLabClass(params) {
  return axiosBase('/basic/instr/getListForLabClass', 'get', params);
}

export function getNoBindReqItem(params) {
  return axiosBase('/basic/labItem/getNotBindListForReqItem', 'get', params);
}
export function getInstrItemList(params) {
  return axiosBase('basic/instrItem/page', 'get', params);
}
export function instrReqItemAdd(params) {
  return axiosBase('/basic/instrItem/add', 'post', params);
}
export function instrReqItemUpdate(params) {
  return axiosBase('/basic/instrItem/update', 'post', params);
}
export function instrReqItemDelete(params) {
  return axiosBase('/basic/instrItem/delete', 'post', params);
}
export function getQCList(params) {
  return axiosBase('/qc/controls/page', 'get', params);
}
export function QCAdd(params) {
  return axiosBase('/qc/controls/add', 'post', params);
}
export function QCUpdate(params) {
  return axiosBase('/qc/controls/update', 'post', params);
}
export function QCDelete(params) {
  return axiosBase('/qc/controls/delete', 'post', params);
}
export function QCExport(params) {
  return axiosBase('/qc/controls/export', 'get', params);
}
export function QCItemList(params) {
  return axiosBase('/qc/controlsItem/page', 'get', params);
}
export function getNotBindQcListForReqItem(params) {
  return axiosBase('/basic/labItem/getNotBindQcListForReqItem', 'get', params);
}
export function controlsItemAdd(params) {
  return axiosBase('/qc/controlsItem/add', 'post', params);
}
export function controlsItemUpdate(params) {
  return axiosBase('/qc/controlsItem/update', 'post', params);
}
export function controlsItemDelete(params) {
  return axiosBase('/qc/controlsItem/delete', 'post', params);
}
export function controlsItemStatusChange(params) {
  return axiosBase('/qc/controlsItem/change', 'post', params);
}
export function listByUserForItemTgValue(params) {
  return axiosBase('basic/labClass/listByUserForItemTgValue', 'get', params);
}
export function itemTgValueList(params) {
  return axiosBase('qc/itemTgValue/page', 'get', params);
}
export function itemTgValueAdd(params) {
  return axiosBase('qc/itemTgValue/add', 'post', params);
}
export function itemTgValueUpdate(params) {
  return axiosBase('qc/itemTgValue/update', 'post', params);
}
export function itemTgValueDelete(params) {
  return axiosBase('qc/itemTgValue/delete', 'post', params);
}
export function itemTgValueStop(params) {
  return axiosBase('qc/itemTgValue/stop', 'post', params);
}
