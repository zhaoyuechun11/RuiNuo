import axios from '@/utils/http';

export function reportUnitInstr(params) {
  return axios('basic/reportUnitInstr/getList', 'get', params);
}
export function executorByReportUnit(params) {
  return axios('sys/user/listByReportUnit', 'get', params);
}
