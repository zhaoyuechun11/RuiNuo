import axios from '@/utils/http';

export async function permission(params) {
  return axios(`/sys/permission/page`, 'get', params);
}
export async function updateAlias(params) {
  return axios(`/sys/permission/update`, 'post', params);
}
export async function deletePermission(params) {
  return axios(`/sys/permission/delete`, 'post', params);
}
