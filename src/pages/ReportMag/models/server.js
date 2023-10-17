import axiosBase from '@utils/http';
export function getReportList(params) {
  return axiosBase('lab/reportMain/page', 'get', params);
}
