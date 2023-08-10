import isFunction from 'lodash/isFunction';
import { reportMainDataList, reportDataDetaiTableHeader,reportListTableHeader } from './server';
const generalInspectionMag = {
  namespace: 'generalInspectionMag',
  state: {
    singleInstrument: [],
    multiInstrument: [],
    sampleNo: [],
    manualAllocation: [],
    singleInstrSeletedKeys: [],
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
