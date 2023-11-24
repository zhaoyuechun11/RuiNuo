import axiosBase from '@utils/http';
export function getInstrByLabClassName(params) {
  return axiosBase('/basic/instr/getListForLabClassIdName', 'get', params);
}
export function getListForLabClass(params) {
  return axiosBase('/basic/instr/getListForLabClass', 'get', params);
}

export function getNoBindReqItem(params) {
  return axiosBase('/basic/labItem/getNotBindListForReqItem', 'get', params);
}
export function getInstrItemList(params) {
  return axiosBase('basic/instrItem/page', 'get', params);
}
export function instrReqItemAdd(params) {
  return axiosBase('/basic/instrItem/add', 'post', params);
}
export function instrReqItemUpdate(params) {
  return axiosBase('/basic/instrItem/update', 'post', params);
}
export function instrReqItemDelete(params) {
  return axiosBase('/basic/instrItem/delete', 'post', params);
}
export function getQCList(params) {
  return axiosBase('/qc/controls/page', 'get', params);
}
export function QCAdd(params) {
  return axiosBase('/qc/controls/add', 'post', params);
}
export function QCUpdate(params) {
  return axiosBase('/qc/controls/update', 'post', params);
}
export function QCDelete(params) {
  return axiosBase('/qc/controls/delete', 'post', params);
}
export function QCExport(params) {
  return axiosBase('/qc/controls/export', 'get', params);
}
export function QCItemList(params) {
  return axiosBase('/qc/controlsItem/page', 'get', params);
}
export function getNotBindQcListForReqItem(params) {
  return axiosBase('/basic/labItem/getNotBindQcListForReqItem', 'get', params);
}
export function controlsItemAdd(params) {
  return axiosBase('/qc/controlsItem/add', 'post', params);
}
export function controlsItemUpdate(params) {
  return axiosBase('/qc/controlsItem/update', 'post', params);
}
export function controlsItemDelete(params) {
  return axiosBase('/qc/controlsItem/delete', 'post', params);
}
export function controlsItemStatusChange(params) {
  return axiosBase('/qc/controlsItem/change', 'post', params);
}
export function listByUserForItemTgValue(params) {
  return axiosBase('basic/labClass/listByUserForItemTgValue', 'get', params);
}
export function itemTgValueList(params) {
  return axiosBase('qc/itemTgValue/page', 'get', params);
}
export function itemTgValueAdd(params) {
  return axiosBase('qc/itemTgValue/add', 'post', params);
}
export function itemTgValueUpdate(params) {
  return axiosBase('qc/itemTgValue/update', 'post', params);
}
export function itemTgValueDelete(params) {
  return axiosBase('qc/itemTgValue/delete', 'post', params);
}
export function itemTgValueStop(params) {
  return axiosBase('qc/itemTgValue/stop', 'post', params);
}
export function getInstrByClassName(params) {
  return axiosBase('basic/labClass/listLabClassInstr', 'get', params);
}
export function getRuleSetingList(params) {
  return axiosBase('qc/rule/page', 'get', params);
}
export function getItemByInstr(params) {
  return axiosBase('basic/instrItem/getInstrItemList', 'get', params);
}
export function ruleSettingAdd(params) {
  return axiosBase('qc/rule/add', 'post', params);
}
export function ruleSettingDelete(params) {
  return axiosBase('/qc/rule/delete', 'post', params);
}
export function ruleSettingUpdate(params) {
  return axiosBase('qc/rule/update', 'post', params);
}
export function listWithInstr(params) {
  return axiosBase('basic/labClass/listWithInstr', 'get', params);
}
export function convertRuleList(params) {
  return axiosBase('qc/convertRule/page', 'get', params);
}
export function getQcListForInstr(params) {
  return axiosBase('basic/labItem/getQcListForInstr', 'get', params);
}
export function convertRuleAdd(params) {
  return axiosBase('qc/convertRule/add', 'post', params);
}
export function convertRuleUpdate(params) {
  return axiosBase('qc/convertRule/update', 'post', params);
}
export function convertRuleDelete(params) {
  return axiosBase('qc/convertRule/delete', 'post', params);
}
export function dataGatherSetList(params) {
  return axiosBase('qc/dataGatherSet/page', 'get', params);
}
export function getQcListForLabClass(params) {
  return axiosBase('qc/controls/getListForLabClass', 'get', params);
}
export function dataGatherSetAdd(params) {
  return axiosBase('qc/dataGatherSet/add', 'post', params);
}
export function dataGatherSetUpdate(params) {
  return axiosBase('qc/dataGatherSet/update', 'post', params);
}
export function dataGatherSetDelete(params) {
  return axiosBase('qc/dataGatherSet/delete', 'post', params);
}
export function dataMaintenanceAdd(params) {
  return axiosBase('qc/data/add', 'post', params);
}
export function getNotBindQcDataListForReqItem(params) {
  return axiosBase('basic/labItem/getNotBindQcDataListForReqItem', 'get', params);
}
export function dataMaintenanceUpdate(params) {
  return axiosBase('qc/data/update', 'post', params);
}
export function dataMaintenanceList(params) {
  return axiosBase('qc/data/page', 'get', params);
}
export function modifyLogAdd(params) {
  return axiosBase('qc/modifyLog/add', 'post', params);
}
export function dataMaintenanceDelete(params) {
  return axiosBase('qc/data/delete', 'post', params);
}
export function qcDataQueryList(params) {
  return axiosBase('qc/data/pageList', 'get', params);
}
export function getQcListForLabClas(params) {
  return axiosBase('qc/controls/getListForLabClass', 'get', params);
}
export function modifyLogList(params) {
  return axiosBase('qc/modifyLog/page', 'get', params);
}
export function getQcListDataForInstr(params) {
  return axiosBase('/qc/controls/getListForInstr', 'get', params);
}
export function monthStatisticsDetail(params) {
  return axiosBase('qc/data/monthStatisticsDetail', 'get', params);
}
export function monthStatistics(params) {
  return axiosBase('qc/data/monthStatistics', 'get', params);
}
