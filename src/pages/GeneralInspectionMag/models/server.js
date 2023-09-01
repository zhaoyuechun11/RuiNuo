import axios from '@/utils/http';

export function reportUnitInstr(params) {
  return axios('basic/reportUnitInstr/getList', 'get', params);
}
export function executorByReportUnit(params) {
  return axios('sys/user/listByReportUnit', 'get', params);
}
export function getSampleNo(params) {
  return axios('lab/reportResultCommon/getSampleNo', 'get', params);
}
export function oneInstrAllocationScan(params) {
  return axios('lab/reqMainSplit/oneInstrAllocationScan', 'get', params);
}
export function manyInstrAllocationScan(params) {
  return axios('lab/reqMainSplit/manyInstrAllocationScan', 'get', params);
}
export function manualAllocationScan(params) {
  return axios('lab/reqMainSplit/manualAllocationScan', 'get', params);
}
export function instrMachineAllocation(params) {
  return axios('lab/reqMainSplit/instrMachineAllocation', 'post', params);
}
export function getListByInstr(params) {
  return axios('basic/reqItem/getListByInstr', 'get', params);
}
export function manualMachineAllocation(params) {
  return axios('lab/reqMainSplit/manualMachineAllocation', 'post', params);
}
export function reportMainDataList(params) {
  return axios('sys/assembly/reportMainDataList', 'get', params);
}
export function reportDataDetaiTableHeader(params) {
  return axios('sys/assembly/reportMainDataDetailList', 'get', params);
}
export function reportListTableHeader(params) {
  return axios('sys/assembly/reportMainDataListList', 'get', params);
}
export function screenReportList(params) {
  return axios('lab/reportMain/page', 'get', params);
}
export function reportMain(params) {
  return axios('lab/reportMain', 'get', params);
}
export function reportMainUpdate(params) {
  return axios('lab/reportMain/update', 'post', params);
}
export function updateRefuse(params) {
  return axios('lab/reportMain/updateRefuse', 'post', params);
}
export function reportResult(params) {
  return axios('lab/reportResultCommon/getList', 'get', params);
}
export function getListForInput(params) {
  return axios('basic/labItemResults/getListForInput', 'get', params);
}
export function reportResultUpdate(params) {
  return axios('lab/reportResultCommon/update', 'post', params);
}
export function getReportByReportUnit(params) {
  return axios('basic/labItem/getListForReportUnit', 'get', params);
}
export function reportResultSave(params) {
  return axios('lab/reportResultCommon/save', 'post', params);
}
export function reportResultDelete(params) {
  return axios('lab/reportResultCommon/delete', 'post', params);
}
export function reportProjectDetail(params) {
  return axios('basic/labItem', 'get', params);
}
export function getListByItems(params) {
  return axios('lab/reportResultCommon/getListByItems', 'get', params);
}
export function addCommonDelete(params) {
  return axios('lab/reportTrace/addCommonDelete', 'post', params);
}
export function addCommonUpdate(params) {
  return axios('lab/reportTrace/addCommonUpdate', 'post', params);
}
export function addMainUpdate(params) {
  return axios('lab/reportTrace/addMainUpdate', 'post', params);
}
export function reportResultImages(params) {
  return axios('lab/reportResultImages/list', 'get', params);
}
export function chartData(params) {
  return axios('lab/reportResultCommon/getTrendChartList', 'get', params);
}
export function reportResultImagesChange(params) {
  return axios('lab/reportResultImages/change', 'post', params);
}
export function templateList(params) {
  return axios('basic/itemInputTemplateMain/list', 'get', params);
}
export function templateDetailList(params) {
  return axios('basic/itemInputTemplateDetail/list', 'get', params);
}
export function getExplainContent(params) {
  return axios('lab/reportMain/getExplainContent', 'get', params);
}
export function getExplainSuggestions(params) {
  return axios('basic/wordEntry/getExplainSuggestions', 'get', params);
}
export function updateExplainContent(params) {
  return axios('lab/reportMain/updateExplainContent', 'post', params);
}
export function selectUpdateList(params) {
  return axios('lab/reportResultCommon/selectUpdateList', 'get', params);
}
export function reexamineResult(params) {
  return axios('lab/reexamineResult/page', 'get', params);
}
export function reexamineReq(params) {
  return axios('lab/reexamineReq/list', 'get', params);
}
export function deApprovalList(params) {
  return axios('lab/abnormalTrace/deApprovalPage', 'get', params);
}
