import axios from '@/utils/http';

export function detail(params) {
  return axios('/sys/user/detail', 'get', params);
}
export function updatePassword(params) {
  return axios('/sys/user/updatePassword', 'post', params);
}
