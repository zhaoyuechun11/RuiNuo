import axiosBase from '@utils/http';
export function getMainEnterNotAuth(params) {
  return axiosBase('sys/assembly/getMainEnterNotAuth', 'get', params);
}
export function beforeOrderList(params) {
  return axiosBase('sys/assembly/reqMainComprehensiveQueryOrderList', 'get', params);
}
export function afterOrderList(params) {
  return axiosBase('sys/assembly/reqMainComprehensiveQuerySplitList', 'get', params);
}
export function getOrginOrderList(params) {
    return axiosBase('/lab/reqMainOrder/comprehensiveQueryOrderPage', 'get', params);
  }
  export function getProfessionalApplyForm(params) {
    return axiosBase('/lab/reqMainOrder/comprehensiveQuerySplitPage', 'get', params);
  }
 