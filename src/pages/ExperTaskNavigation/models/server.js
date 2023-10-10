import axios from '@/utils/http';
export function getNodeList(params) {
  return axios('/basic/operationNode/list', 'get', params);
}
export function preOverdueNum(params) {
  return axios('/other/taskNavigation/preOverdueNum', 'get', params);
}
export function preTodayCompleteNum(params) {
  return axios('other/taskNavigation/preTodayCompleteNum', 'get', params);
}
export function preWaitNum(params) {
  return axios('other/taskNavigation/preWaitNum', 'get', params);
}
