import axiosBase from '@utils/http';
export function dictList(params) {
  return axiosBase('/basic/dict/getList', 'get', params);
}
export function paramsSetList(params) {
  return axiosBase('/sys/parameter/page', 'get', params);
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
export function inputTemplate(params) {
  return axiosBase('basic/itemInputTemplateMain/page', 'get', params);
}
export function inputTemplateAdd(params) {
  return axiosBase('basic/itemInputTemplateMain/add', 'post', params);
}
export function inputTemplateUpdate(params) {
  return axiosBase('basic/itemInputTemplateMain/update', 'post', params);
}
export function inputTemplateDelete(params) {
  return axiosBase('basic/itemInputTemplateMain/delete', 'post', params);
}
export function inputTemplateDetail(params) {
  return axiosBase('basic/itemInputTemplateDetail/page', 'get', params);
}
export function inputTemplateDetailAdd(params) {
  return axiosBase('basic/itemInputTemplateDetail/add', 'post', params);
}
export function inputTemplateDetailUpdate(params) {
  return axiosBase('basic/itemInputTemplateDetail/update', 'post', params);
}
export function inputTemplateDetailDelete(params) {
  return axiosBase('basic/itemInputTemplateDetail/delete', 'post', params);
}
export function wordEntry(params) {
  return axiosBase('basic/wordEntry/page', 'get', params);
}
export function wordEntryAdd(params) {
  return axiosBase('basic/wordEntry/add', 'post', params);
}
export function wordEntryUpdate(params) {
  return axiosBase('basic/wordEntry/update', 'post', params);
}
export function wordEntryDelete(params) {
  return axiosBase('basic/wordEntry/delete', 'post', params);
}
export function wordEntryChange(params) {
  return axiosBase('basic/wordEntry/change', 'post', params);
}
export function flowchartList(params) {
  return axiosBase('basic/flowchart/page', 'get', params);
}
export function flowchartAdd(params) {
  return axiosBase('basic/flowchart/add', 'post', params);
}
export function flowchartDelete(params) {
  return axiosBase('basic/flowchart/delete', 'post', params);
}
export function getFlowchart(params) {
  return axiosBase('basic/flowchart/getXmlData', 'get', params);
}
export function flowchartUpdate(params) {
  return axiosBase('basic/flowchart/update', 'post', params);
}
export function flowchartEnable(params) {
  return axiosBase('basic/flowchart/enable', 'post', params);
}
export function getSuitFlowCond(params) {
  return axiosBase('basic/suitFlowCond/page', 'get', params);
}
export function suitFlowCondAdd(params) {
  return axiosBase('basic/suitFlowCond/add', 'post', params);
}
export function flowchart(params) {
  return axiosBase('basic/flowchart/list', 'get', params);
}
export function suitFlowCondUpdate(params) {
  return axiosBase('basic/suitFlowCond/update', 'post', params);
}
export function suitFlowCondDelete(params) {
  return axiosBase('basic/suitFlowCond/delete', 'post', params);
}
export function reportComQueryListPage(params) {
  return axiosBase('sys/module/reportMainComprehensiveQueryPage', 'get', params);
}
export function reportComQueryListPageAdd(params) {
  return axiosBase('/sys/module/addReportMainComprehensiveQuery', 'post', params);
}
export function reportComQueryListPageDefault(params) {
  return axiosBase('/sys/module/updateReportMainComprehensiveQueryDefault', 'post', params);
}
