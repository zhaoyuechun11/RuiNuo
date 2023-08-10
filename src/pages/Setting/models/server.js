import axiosBase from '@utils/http';
export function dictList(params) {
  return axiosBase('/basic/dict/getList', 'get', params);
}
export function paramsSetList(params) {
  return axiosBase('/basic/parameter/page', 'get', params);
}
export function paramsSetAdd(params) {
  return axiosBase('/basic/parameter/add', 'post', params);
}
export function paramsSetUpdate(params) {
  return axiosBase('/basic/parameter/update', 'post', params);
}
export function paramsSetExport(params) {
  return axiosBase('/basic/parameter/export', 'get', params);
}
export function paramsSetDelete(params) {
  return axiosBase('/basic/parameter/delete', 'post', params);
}
export function mainEnterPage(params) {
  return axiosBase('sys/module/mainEnterPage', 'get', params);
}
export function mainEnterPageAdd(params) {
  return axiosBase('sys/module/addReqMainEnter', 'post', params);
}
export function mainEnterPageUpdate(params) {
  return axiosBase('sys/module/update', 'post', params);
}
export function mainEnterPageDele(params) {
  return axiosBase('sys/module/delete', 'post', params);
}
export function updateDefault(params) {
  return axiosBase('sys/module/updateMainEnterDefault', 'post', params);
}

export function reportMainDataPage(params) {
  return axiosBase('sys/module/reportMainDataPage', 'get', params);
}
export function addReportMainData(params) {
  return axiosBase('sys/module/addReportMainData', 'post', params);
}
export function updateReportDataDefault(params) {
  return axiosBase('sys/module/updateReportMainDataDefault', 'post', params);
}
export function reportMainDataDetailPage(params) {
  return axiosBase('sys/module/reportMainDataDetailPage', 'get', params);
}
export function addReportMainDataDetail(params) {
  return axiosBase('sys/module/addReportMainDataDetail', 'post', params);
}
export function updateReportDataDetailDefault(params) {
  return axiosBase('sys/module/updateReportMainDataDetailDefault', 'post', params);
}
export function reportMainDataOperateList(params) {
  return axiosBase('sys/assembly/reportMainDataOperateList', 'get', params);
}
export function reportMainDataListPage(params) {
  return axiosBase('sys/module/reportMainDataListPage', 'get', params);
}
export function reportListDefaultUpdate(params) {
  return axiosBase('sys/module/updateReportMainDataListDefault', 'post', params);
}
export function reportListModalAdd(params) {
  return axiosBase('sys/module/addReportMainDataList', 'post', params);
}
