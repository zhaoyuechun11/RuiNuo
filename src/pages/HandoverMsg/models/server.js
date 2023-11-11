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
export function deliveryReceiptMonth(params) {
  return axiosBase('/lab/deliveryReceipt/getMonthDeliveryReceiptList', 'get', params);
}
export function deliveryReceiptWeek(params) {
  return axiosBase('lab/deliveryReceipt/getWeekDeliveryReceiptList', 'get', params);
}
export function deliveryReceiptType(params) {
  return axiosBase('lab/deliveryReceipt/getDeliveryReceiptType', 'get', params);
}
export function deliveryReceiptExport(params) {
  return axiosBase('/lab/deliveryReceipt/export', 'get', params);
}
export function updateDeliveryStatus(params) {
  return axiosBase('/lab/deliveryReceipt/updateDeliveryStatus', 'post', params);
}
