import isFunction from 'lodash/isFunction';
import {
  reportMainDataList,
  reportDataDetaiTableHeader,
  reportListTableHeader,
  screenReportList,
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
    reportLefUpdate: false,
    reportResultList: [],
    isChangeReportResult: false,
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
