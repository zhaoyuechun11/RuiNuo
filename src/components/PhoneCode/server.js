import axiosBase from '@utils/http';

// 手机号列表
export function getPhoneCodeAPI(params) {
  return axiosBase('/apiweb/common/getPhoneCode', 'GET', params);
}
