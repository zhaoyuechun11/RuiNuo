import axiosBase from '@utils/http';
export function getInstrByLabClassName(params) {
  return axiosBase('/basic/instr/getListForLabClassIdName', 'get', params);
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
