import axios from '@/utils/http';
export async function login(params) {
  //获取公司人员列表
  return axios(`/sys/user/login`, 'post', params);
}
