import axios from '@/utils/http';

export function getRewardStatisticsList(params) {
  return axios('/apiweb/recommendation/awardList', 'get', params);
}

export function getFirstPage(params) {
  return axios('/basic/dict/firstPage', 'get', params);
}
export function getSecondPage(params) {
  return axios('/basic/dict/SecondPage', 'get', params);
}
export function add(params) {
  return axios('/basic/dict/add', 'post', params);
}
export function update(params) {
  return axios('/basic/dict/update', 'post', params);
}
export function deleteBasic(params) {
  return axios('/basic/dict/delete', 'post', params);
}
export function exportBasic(params) {
  return axios('/basic/dict/export', 'get', params);
}
export function change(params) {
  return axios('/basic/dict/change', 'post', params);
}
export function taskPageData(params) {
  return axios('/basic/dict/taskPage', 'get', params);
}
export function getBinds(params) {
  return axios('/basic/reqItemTask/getBinds', 'get', params);
}
export function getBindsList(params) {
  return axios('/basic/reqItem/getList', 'get', params);
}
export function addBind(params) {
  return axios('/basic/reqItemTask/add', 'post', params);
}
export function getManageGroupList(params) {
  return axios('/basic/labClassManage/page', 'get', params);
}
export function getManageGroupAdd(params) {
  return axios('/basic/labClassManage/add', 'post', params);
}
export function updateManageGroup(params) {
  return axios('/basic/labClassManage/update', 'post', params);
}
export function deleteManageGroup(params) {
  return axios('/basic/labClassManage/delete', 'post', params);
}
export function getMajorGroupList(params) {
  return axios('/basic/labClass/page', 'get', params);
}
export function addMajorGroup(params) {
  return axios('/basic/labClass/add', 'post', params);
}
export function updateMajorGroup(params) {
  return axios('/basic/labClass/update', 'post', params);
}
export function manageListSelect(params) {
  return axios('/basic/labClassManage/list', 'get', params);
}
export function deleteMajorGroup(params) {
  return axios('/basic/labClass/delete', 'post', params);
}
export function getBindsOnMajorGroup(params) {
  return axios('/basic/labClassRefSampleType/getBinds', 'get', params);
}
export function addBindsOnMajorGroup(params) {
  return axios('/basic/labClassRefSampleType/add', 'post', params);
}
export function getInstrList(params) {
  return axios('/basic/instr/page', 'get', params);
}
export function addInstr(params) {
  return axios('/basic/instr/add', 'post', params);
}
export function updateInstr(params) {
  return axios('/basic/instr/update', 'post', params);
}
export function deleteInstr(params) {
  return axios('/basic/instr/delete', 'post', params);
}
export function transferInstrList(params) {
  return axios('/basic/instr/getList', 'get', params);
}
export function majorGroup(params) {
  return axios('/basic/labClass/list', 'get', params);
}
export function getBindsOnInstr(params) {
  return axios('/basic/instrLabClass/getBinds', 'get', params);
}
export function addBindsOnInstr(params) {
  return axios('/basic/instrLabClass/add', 'post', params);
}
export function getHospitalList(params) {
  return axios('/basic/hospital/page', 'get', params);
}
export function addHospital(params) {
  return axios('/basic/hospital/add', 'post', params);
}
export function updateHospital(params) {
  return axios('/basic/hospital/update', 'post', params);
}
export function deleteHospital(params) {
  return axios('/basic/hospital/delete', 'post', params);
}
export function hospitalIsDisable(params) {
  return axios('/basic/hospital/change', 'post', params);
}
export function hospitalSelectList(params) {
  return axios('/basic/hospital/getList', 'get', params);
}

export function oneLevelTypeModalSel(params) {
  return axios('/basic/dict/getList', 'get', params);
}
export function getUserList(params) {
  return axios('/sys/user/list', 'get', params);
}
export function getArea(params) {
  return axios('/basic/area/getAll', 'get', params);
}
export function instrExport(params) {
  return axios('/basic/instr/export', 'get', params);
}
export function majorGroupExport(params) {
  return axios('/basic/labClass/export', 'get', params);
}
export function manageGroupExport(params) {
  return axios('/basic/labClassManage/export', 'get', params);
}
export function hospitalExport(params) {
  return axios('/basic/hospital/export', 'get', params);
}
export function basicDataExport(params) {
  return axios('/basic/dict/export', 'get', params);
}
export function applyProjectList(params) {
  return axios('/basic/reqItem/page', 'get', params);
}

export function getSameProfessionList(params) {
  return axios('/basic/reqItem/getSameProfessionList', 'get', params);
}

export function getDifferentProfessionList(params) {
  return axios('/basic/reqItem/getDifferentProfessionList', 'get', params);
}
export function applyProjectAdd(params) {
  return axios('/basic/reqItem/add', 'post', params);
}
export function applyProjectUpdate(params) {
  return axios('/basic/reqItem/update', 'post', params);
}
export function applyProjectDelete(params) {
  return axios('/basic/reqItem/delete', 'post', params);
}
export function applyProjectState(params) {
  return axios('/basic/reqItem/change', 'post', params);
}
export function applyProjectItemBindPage(params) {
  return axios('/basic/reqItemHospital/itemBindPage', 'get', params);
}

export function applyProjectByIdGetBinds(params) {
  return axios('/basic/reqItemHospital/getBinds', 'get', params);
}

export function applyProjectByIdAddBind(params) {
  return axios('/basic/reqItemHospital/add', 'post', params);
}
export function applyProjectByIdDeleteBind(params) {
  return axios('/basic/reqItemHospital/delete', 'post', params);
}
export function applyProjectItemBindComposition(params) {
  return axios('/basic/reqItemComposition/itemPage', 'get', params);
}
export function applyProjectItemByCompGetBinds(params) {
  return axios('/basic/reqItemComposition/getBinds', 'get', params);
}
export function applyProjectItemByCompBindAdd(params) {
  return axios('/basic/reqItem/bindItem', 'post', params);
}
export function applyProjectItemByCompBindDe(params) {
  return axios('/basic/reqItemComposition/delete', 'post', params);
}
export function applyProjectItemInstr(params) {
  return axios('/basic/reqItemInstr/instrPage', 'get', params);
}
export function APItemInstrBinds(params) {
  return axios('/basic/reqItemInstr/getBinds', 'get', params);
}
export function APItemInstrBindsAdd(params) {
  return axios('/basic/reqItemInstr/add', 'post', params);
}
export function APItemInstrBindsState(params) {
  return axios('/basic/reqItemInstr/change', 'post', params);
}
export function APItemInstrBindsDelete(params) {
  return axios('/basic/reqItemInstr/delete', 'post', params);
}
export function APItemReport(params) {
  return axios('/basic/reqItemLabItem/labItemPage', 'get', params);
}
export function APItemReportBindsTranL(params) {
  return axios('/basic/labItem/getListForReqItem', 'get', params);
}
export function APItemReportBindsTranR(params) {
  return axios('/basic/reqItemLabItem/getBinds', 'get', params);
}
export function APItemReportBindsAdd(params) {
  return axios('/basic/reqItemLabItem/add', 'post', params);
}
export function APItemReportBindsDel(params) {
  return axios('/basic/reqItemLabItem/delete', 'post', params);
}
export function labItemResultsList(params) {
  return axios('/basic/labItemResults/getList', 'get', params);
}
export function labItemResultsUpdate(params) {
  return axios('/basic/reqItemLabItem/update', 'post', params);
}
export function reqItemPriceList(params) {
  return axios('/basic/reqItemPrice/priceTypePage', 'get', params);
}
export function getGuidPriceNoBind(params) {
  return axios('/basic/dict/getPriceListByReqItem', 'get', params);
}
export function guidPriceAddBind(params) {
  return axios('/basic/reqItemPrice/add', 'post', params);
}
export function guidPriceUpdateBind(params) {
  return axios('/basic/reqItemPrice/update', 'post', params);
}
export function guidPriceDeleteBind(params) {
  return axios('/basic/reqItemPrice/delete', 'post', params);
}
export function reportProjectList(params) {
  return axios('/basic/labItem/page', 'get', params);
}
export function reportProjectAdd(params) {
  return axios('/basic/labItem/add', 'post', params);
}
export function reportProjectUpdate(params) {
  return axios('/basic/labItem/update', 'post', params);
}
export function reportProjectDelete(params) {
  return axios('/basic/labItem/delete', 'post', params);
}
export function reportProjectExport(params) {
  return axios('/basic/labItem/export', 'get', params);
}
export function RPInstrChannelNum(params) {
  return axios('/basic/labItemInter/interPage', 'get', params);
}
export function RPInstrChannelNumAdd(params) {
  return axios('/basic/labItemInter/add', 'post', params);
}
export function RPInstrChannelNumUpdate(params) {
  return axios('/basic/labItemInter/update', 'post', params);
}
export function RPInstrChannelNumDele(params) {
  return axios('/basic/labItemInter/delete', 'post', params);
}
export function RPreferenceValue(params) {
  return axios('/basic/labItemRef/refPage', 'get', params);
}
export function RPreferenceValueAdd(params) {
  return axios('/basic/labItemRef/add', 'post', params);
}
export function RPreferenceValueUpdate(params) {
  return axios('/basic/labItemRef/update', 'post', params);
}
export function RPreferenceValueDele(params) {
  return axios('/basic/labItemRef/delete', 'post', params);
}
export function RPCriticalValue(params) {
  return axios('/basic/labItemCriticalValue/criticalValuePage', 'get', params);
}
export function RPCriticalValueAdd(params) {
  return axios('/basic/labItemCriticalValue/add', 'post', params);
}
export function RPCriticalValueUpdate(params) {
  return axios('/basic/labItemCriticalValue/update', 'post', params);
}
export function RPCriticalValueDele(params) {
  return axios('/basic/labItemCriticalValue/delete', 'post', params);
}

export function formulaList(params) {
  return axios('/basic/labItemFormula/formulaPage', 'get', params);
}
export function reportProjectSele(params) {
  return axios('/basic/labItem/getList', 'get', params);
}
export function getCalculationResults(params) {
  return axios('/other/utils/getCalculationResults', 'get', params);
}
export function formulaAdd(params) {
  return axios('/basic/labItemFormula/add', 'post', params);
}
export function formulaUpdate(params) {
  return axios('/basic/labItemFormula/update', 'post', params);
}
export function formulaDele(params) {
  return axios('/basic/labItemFormula/delete', 'post', params);
}
export function applyProjectExport(params) {
  return axios('/basic/reqItem/export', 'get', params);
}
export function commonResults(params) {
  return axios('/basic/labItemResults/resultPage', 'get', params);
}
export function commonResultsAdd(params) {
  return axios('/basic/labItemResults/add', 'post', params);
}
export function commonResultsUpdate(params) {
  return axios('/basic/labItemResults/update', 'post', params);
}
export function commonResultsDele(params) {
  return axios('/basic/labItemResults/delete', 'post', params);
}
export function printOrder(params) {
  return axios('/basic/labItemPrintOrder/printOrderPage', 'get', params);
}
export function printOrderAdd(params) {
  return axios('/basic/labItemPrintOrder/add', 'post', params);
}
export function printOrderUpdate(params) {
  return axios('/basic/labItemPrintOrder/update', 'post', params);
}
export function printOrderDele(params) {
  return axios('/basic/labItemPrintOrder/delete', 'post', params);
}
export function insUnitDiscountList(params) {
  return axios('/basic/hospitalItemPrice/page', 'get', params);
}
export function insUnitDiscountListExport(params) {
  return axios('/basic/hospitalItemPrice/export', 'get', params);
}
export function insUnitDiscountAdd(params) {
  return axios('/basic/hospitalItemPrice/add', 'post', params);
}
export function insUnitDiscountDele(params) {
  return axios('/basic/hospitalItemPrice/delete', 'post', params);
}
