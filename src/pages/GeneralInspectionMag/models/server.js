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
