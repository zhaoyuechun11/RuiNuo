import axios from '@/utils/http';
export function consultRegisterAdd(params) {
  return axios('lab/consultRegister/add', 'post', params);
}
export function consultRegisterList(params) {
  return axios('lab/consultRegister/page', 'get', params);
}
export function consultRegisterUpdate(params) {
  return axios('lab/consultRegister/update', 'post', params);
}
export function consultRegisterDelete(params) {
  return axios('lab/consultRegister/delete', 'post', params);
}
export function consultRegisterExport(params) {
  return axios('lab/consultRegister/export', 'get', params);
}
export function monthStatistics(params) {
  return axios('lab/consultRegister/monthStatistics', 'get', params);
}
export function weekStatistics(params) {
  return axios('lab/consultRegister/weekStatistics', 'get', params);
}
export function weekStatisticsExport(params) {
  return axios('lab/consultRegister/weekStatisticsExport', 'get', params);
}
export function monthStatisticsExport(params) {
  return axios('lab/consultRegister/monthStatisticsExport', 'get', params);
}
