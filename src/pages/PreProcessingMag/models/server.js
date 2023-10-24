import axiosBase from '@utils/http';

export function showCustomHeader(params) {
  return axiosBase('sys/assembly/mainEnterDataList', 'get', params);
}
export function saveCustomHeader(params) {
  return axiosBase('sys/assembly/updateListSeq', 'post', params);
}
export function mainEnterOperateList(params) {
  return axiosBase('sys/assembly/mainEnterOperateList', 'get', params);
}
export function mainEnterEnterList(params) {
  return axiosBase('sys/assembly/mainEnterEnterList', 'get', params);
}
export function moduleList(params) {
  return axiosBase('sys/module/mainEnterList', 'get', params);
}
export function getArea(params) {
  return axiosBase('/basic/area/getAll', 'get', params);
}

export function getDictList(params) {
  return axiosBase('/basic/dict/getList', 'get', params);
}

export function enterAdd(params) {
  return axiosBase('lab/reqMainOrder/add', 'post', params);
}
export async function getMainOrder(params) {
  return axiosBase(`/lab/reqMainOrder`, 'get', params);
}
export function reqMainOrder(params) {
  return axiosBase('lab/reqMainOrder/page', 'get', params);
}
export function majorGroup(params) {
  return axiosBase('/basic/labClass/list', 'get', params);
}
export function reqMainOrderUpdate(params) {
  return axiosBase('lab/reqMainOrder/update', 'post', params);
}
export function reqMainOrderDelete(params) {
  return axiosBase('lab/reqMainOrder/delete', 'post', params);
}
export function reqMainOrderExport(params) {
  return axiosBase('lab/reqMainOrder/export', 'get', params);
}
export function getQueryData(params) {
  return axiosBase('sys/queryAssembly/reqMainEnterDetail', 'get', params);
}
export function saveCustomQuery(params) {
  return axiosBase('sys/queryAssembly/updateReqMainEnter', 'post', params);
}
export function getApplicationForm(params) {
  return axiosBase('lab/reqMainOrder/examinePage', 'get', params);
}
export function pageForReqMainEnter(params) {
  return axiosBase('basic/reqItem/pageForReqMainEnter', 'get', params);
}
export function reportItems(params) {
  return axiosBase('basic/reqItemLabItem/getListByReqItem', 'get', params);
}
export function userList(params) {
  return axiosBase('sys/user/list', 'get', params);
}
export function examineData(params) {
  return axiosBase('lab/reqMainOrder/examine', 'post', params);
}
export function examineDataCustomHeader(params) {
  return axiosBase('sys/assembly/mainExamineDataList', 'get', params);
}
export function scanSorting(params) {
  return axiosBase('lab/reqMainSplit/preSortList', 'get', params);
}
export function scanSortingSave(params) {
  return axiosBase('lab/reqMainSplit/preSort', 'post', params);
}
export function sortingList(params) {
  return axiosBase('lab/reqMainSplit/preSortPage', 'get', params);
}

export function waitBlood(params) {
  return axiosBase('lab/reqMainSplit/bloodPage', 'get', params);
}
export function finishBlood(params) {
  return axiosBase('lab/reqMainSplit/bloodCompletePage', 'get', params);
}
export function scanBlood(params) {
  return axiosBase('lab/reqMainSplit/bloodList', 'get', params);
}
export function bloodSave(params) {
  return axiosBase('lab/reqMainSplit/blood', 'post', params);
}
export function scanSampleHandover(params) {
  return axiosBase('lab/reqMainSplit/preTransferList', 'get', params);
}
export function sampleHandover(params) {
  return axiosBase('lab/reqMainSplit/preTransferPage', 'get', params);
}
export function sampleHandoverSave(params) {
  return axiosBase('lab/reqMainSplit/preTransfer', 'post', params);
}
export function recipientList(params) {
  return axiosBase('/sys/user/recipientList', 'get', params);
}
export function verifyPassword(params) {
  return axiosBase('sys/user/verifyPassword', 'post', params);
}
export function labClassByUser(params) {
  return axiosBase('basic/labClass/listByUser', 'get', params);
}
export function preTransferNum(params) {
  return axiosBase('lab/reqMainSplit/preTransferNum', 'get', params);
}
export function preSortNum(params) {
  return axiosBase('lab/reqMainSplit/preSortNum', 'get', params);
}
