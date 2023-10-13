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
export function proFlowData(params) {
  return axios('/other/taskNavigation/proFlowData', 'get', params);
}
export function proOverdueNum(params) {
  return axios('/other/taskNavigation/proOverdueNum', 'get', params);
}
export function proTodayCompleteNum(params) {
  return axios('/other/taskNavigation/proTodayCompleteNum', 'get', params);
}
export function proWaitNum(params) {
  return axios('/other/taskNavigation/proWaitNum', 'get', params);
}
export function detailList(params) {
  return axios('/lab/reqMainSplit/detailListPage', 'get', params);
}
