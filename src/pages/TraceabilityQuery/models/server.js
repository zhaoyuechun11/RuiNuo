import axiosBase from '@utils/http';
export function getInstrByReportUnit(params) {
  return axiosBase('/basic/reportUnitInstr/getList', 'get', params);
}
export function reportTrace(params) {
  return axiosBase('lab/reportTrace/page', 'get', params);
}
export function reqTrace(params) {
  return axiosBase('lab/reqTrace/page', 'get', params);
}
export function abnormalTrace(params) {
  return axiosBase('lab/abnormalTrace/page', 'get', params);
}
