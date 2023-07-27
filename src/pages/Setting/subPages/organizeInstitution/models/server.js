import axios from '@/utils/http';

export async function getRoleIndex(params) {
  //角色列表
  return axios(`/sys/role/page`, 'get', params);
}

export async function roleAdd(params) {
  //新增角色
  // return axios(`/apiweb/role/store`, 'post', params);
  return axios(`/sys/role/add`, 'post', params);
}

export async function roleEdit(params) {
  //编辑角色
  return axios(`/sys/role/update`, 'post', params);
}

export async function roleDel(params) {
  //删除角色
  return axios(`/sys/role/delete`, 'post', params);
}

export async function permissList(params) {
  return axios(`/sys/permission/list`, 'get', params);
}

export async function listForRole(params) {
  return axios(`/sys/permission/listForRole`, 'get', params);
}

export async function updateBind(params) {
  return axios(`/sys/role/updateBind`, 'get', params);
}
export async function getRoleAssign(params) {
  //已分配角色列表
  return axios(`/apiweb/roleAssign/index`, 'get', params);
}

export async function getParentIndex(params) {
  //可选择的父级角色列表
  return axios(`/apiweb/role/parentIndex`, 'get', params);
}
export function sysAuthorization(params) {
  return axios('sys/funcAuthorization/list', 'get', params);
}
export function sysAuthorizationAdd(params) {
  return axios('sys/roleFunc/add', 'post', params);
}
export function sysAuthorBinds(params) {
  return axios('sys/roleFunc/getBinds', 'get', params);
}
export function reportUnitLists(params) {
  return axios('basic/reportUnit/getList', 'get', params);
}
export function reportUnitBinds(params) {
  return axios('sys/roleReportUnit/getBinds', 'get', params);
}
