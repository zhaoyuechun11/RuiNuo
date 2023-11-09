import axiosBase from '@utils/http';
export function deliveryReceiptAdd(params) {
  return axiosBase('/lab/deliveryReceipt/add', 'post', params);
}
export function getBarName(params) {
  return axiosBase('/lab/deliveryReceipt/getBarName', 'get', params);
}
export function deliveryReceiptList(params) {
  return axiosBase('/lab/deliveryReceipt/list', 'get', params);
}
export function deliveryReceiptUpdate(params) {
  return axiosBase('/lab/deliveryReceipt/update', 'post', params);
}
export function deliveryReceiptDelete(params) {
  return axiosBase('/lab/deliveryReceipt/delete', 'post', params);
}
