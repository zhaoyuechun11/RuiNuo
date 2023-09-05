import isFunction from 'lodash/isFunction';
import {
  reportMainDataList,
  reportDataDetaiTableHeader,
  reportListTableHeader,
  screenReportList,
  reexamineResult,
  reexamineReq,
  deApprovalList,
} from './server';
const generalInspectionMag = {
  namespace: 'generalInspectionMag',
  state: {
    singleInstrument: [],
    multiInstrument: [],
    sampleNo: [],
    manualAllocation: [],
    singleInstrSeletedKeys: [],
    instrAndRecordId: { id: '', instrId: '' },
    reportLeftData: [],
    reportLeftVal: [],
    reportLefUpdate: false,
    reportMiddleUpdate: false,
    reportResultList: [],
    isChangeReportResult: false,
    isAdd: false,
    resultListCheckItemUsed: [],
    templateId: [],
    batchAdd: false,
    resultUpdateRecord: [],
    personList: [],
    reportUnitInstrList: [],
    reviewList: [],
    reviewReultsList: [],
    reviewReultsFlag:false
  },
  effects: {
    *fetchReportMainDataList({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(reportMainDataList, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchReportDetaiTableHeader({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(reportDataDetaiTableHeader, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchReportListTableHeader({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(reportListTableHeader, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchCreenReportList({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(screenReportList, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchReexamineResult({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(reexamineResult, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchReexamineReq({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(reexamineReq, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchDeApprovalList({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(deApprovalList, { ...params });
      isFunction(callback) && callback(response);
    },
  },
  reducers: {
    save(state, { payload: { type, dataSource } }) {
      return {
        ...state,
        [type]: dataSource,
      };
    },
  },
};
export default generalInspectionMag;
