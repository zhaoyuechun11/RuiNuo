import axios from '@/utils/http';

export async function dept(params) {
  return axios(`/basic/dept/page`, 'get', params);
}

export async function statusChange(params) {
  return axios(`/basic/dept/change`, 'post', params);
}
export async function deletePermission(params) {
  return axios(`/sys/permission/delete`, 'post', params);
}
export async function deptList(params) {
  return axios(`/basic/dept/list`, 'get', params);
}
export async function deptAdd(params) {
  return axios(`/basic/dept/add`, 'post', params);
}
export async function deptUpdate(params) {
  return axios(`/basic/dept/update`, 'post', params);
}
export async function deptDelete(params) {
  return axios(`basic/dept/delete`, 'post', params);
}
