import axiosBase from '@utils/http';
export function getReportList(params) {
  return axiosBase('lab/reportMain/page', 'get', params);
}
export function reportComQueryList(params) {
  return axiosBase('sys/module/reportMainComprehensiveQueryList', 'get', params);
}
export function reportOrderQuery(params) {
  return axiosBase('sys/queryAssembly/reportMainEnterDetail', 'get', params);
}
export function reportOrderQuerySave(params) {
  return axiosBase('sys/queryAssembly/updateReportMainEnter', 'post', params);
}
export function byHospitalGetReport(params) {
  return axiosBase('lab/reportMain/getHospitalList', 'get', params);
}
export function getReportListByHos(params) {
  return axiosBase('lab/reportMain/getReportCommon', 'get', params);
}
export function reportCompQueryExport(params) {
  return axiosBase('lab/reportMain/reportComprehensiveQueryExport', 'get', params);
}
export function reportMainHospitalQuery(params) {
  return axiosBase('sys/queryAssembly/reportMainHospital', 'get', params);
}
export function reportMainHospitalSave(params) {
  return axiosBase('/sys/queryAssembly/updateReportMainHospital', 'post', params);
}
