import {
  getFirstPage,
  getSecondPage,
  change,
  taskPageData,
  getBinds,
  getManageGroupList,
  getMajorGroupList,
  getInstrList,
  getHospitalList,
  hospitalIsDisable,
  applyProjectList,
  applyProjectState,
  applyProjectItemBindPage,
  applyProjectItemBindComposition,
  applyProjectItemInstr,
  APItemInstrBindsState,
  APItemReport,
  reqItemPriceList,
  reportProjectList,
  RPInstrChannelNum,
  RPreferenceValue,
  RPCriticalValue,
  formulaList,
  commonResults,
  printOrder,
  insUnitDiscountList,
  oneLevelTypeModalSel
} from './server';

import isFunction from 'lodash/isFunction';
const commonMaterials = {
  namespace: 'commonMaterials',
  state: {},
  effects: {
    *fetchSecondPage({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(getSecondPage, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchFirstPage({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(getFirstPage, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchIsDisable({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(change, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchTaskPageData({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(taskPageData, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchBinds({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(getBinds, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchManageGroupList({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(getManageGroupList, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchMajorGroupList({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(getMajorGroupList, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchInstrList({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(getInstrList, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchHospitalList({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(getHospitalList, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchHospitalIsDisable({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(hospitalIsDisable, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchApplyProjectList({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(applyProjectList, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchApplyProjectState({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(applyProjectState, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchApplyProjectItemBindPage({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(applyProjectItemBindPage, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchAPItemBindComposition({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(applyProjectItemBindComposition, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchApplyProjectItemInstr({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(applyProjectItemInstr, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchAPItemInstrBindsState({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(APItemInstrBindsState, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchAPItemReport({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(APItemReport, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchReqItemPriceList({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(reqItemPriceList, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchreRortProjectList({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(reportProjectList, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchreRPInstrChannelNum({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(RPInstrChannelNum, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchRPreferenceValue({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(RPreferenceValue, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchRPCriticalValue({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(RPCriticalValue, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchFormulaList({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(formulaList, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchCommonResults({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(commonResults, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchPrintOrder({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(printOrder, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchInsUnitDiscountList({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(insUnitDiscountList, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchOneLevelTypeModalSel({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(oneLevelTypeModalSel, { ...params });
      isFunction(callback) && callback(response);
    },
  },
};
export default commonMaterials;
