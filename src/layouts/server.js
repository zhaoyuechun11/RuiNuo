import axiosBase from '@utils/http';

// 发送验证码
export function sendCode(params) {
  return axiosBase('/apiweb/message/sendCode', 'post', params);
}
// 验证验证码
export function checkCode(params) {
  return axiosBase('/apiweb/message/checkCode', 'post', params);
}
// 绑定手机号
export function bindData(params) {
  return axiosBase('/apiweb/operator/bindData', 'post', params);
}
