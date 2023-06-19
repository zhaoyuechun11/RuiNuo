import axios from '@/utils/http';

export async function getAuthDepartment(params) {
  //获取公司组织架构数据
  return axios(`/apiweb/authDepartment/index`, 'get', params);
}

export async function getMemberList(params) {
  //获取公司人员列表
  return axios(`/sys/user/page`, 'get', params);
}

export async function getRoleAssign(params) {
  //已分配角色列表
  return axios(`/apiweb/roleAssign/index`, 'get', params);
}

export async function RoleAssignStore(params) {
  //单个员工分配角色
  return axios(`/apiweb/roleAssign/store`, 'post', params);
}

export async function RoleAssignBatch(params) {
  //批量分配角色
  return axios(`/apiweb/roleAssign/batchStore`, 'post', params);
}

export async function getRoleList(params) {
  //获取角色列表
  return axios(`/sys/role/page`, 'get', params);
}
export async function getList(params) {
  //获取角色列表
  return axios(`/sys/role/getList`, 'get', params);
}
export async function resetPwd(params) {
  //重置密码
  return axios(`/sys/user/reset`, 'post', params);
}

export async function changeAuth(params) {
  //授权
  return axios(`/sys/user/change`, 'post', params);
}

export async function getShareData(params) {
  //获取共享人数据列表
  return axios(`/apiweb/share/getDataList`, 'get', params);
}

export async function getSelectShareData(params) {
  //已选择的共享人数据
  return axios(`/apiweb/share/getSelectList`, 'get', params);
}

export async function saveShareId(params) {
  //保存已选择的人员
  return axios(`/apiweb/share/save`, 'get', params);
}

export async function getOperatorList(params) {
  //获取接收负责人数据
  return axios(`/apiweb/taskTransfer/getOperatorList`, 'get', params);
}

export async function userUpdate(params) {
  //获取职位列表数据
  return axios(`/sys/user/update`, 'post', params);
}

export async function userAdd(params) {
  return axios(`/sys/user/add`, 'post', params);
}

export function userDelete(params) {
  //删除单个数据共享人
  return axios(`/sys/user/delete`, 'post', params);
}

// 批量取消人员授权
export function cancelAuth(params) {
  return axios(`/apiweb/relation/batchCancelOperatorAuth`, 'post', params);
}
