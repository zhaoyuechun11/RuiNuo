import isFunction from 'lodash/isFunction';
import {
  mainEnterOperateList,
  moveField,
  addField,
  updateField,
  fieldDelete,
  displayOrRequired,
  reportDataDetailOperateList,
  reportLis
} from './server';
const IndexModel = {
  namespace: 'sampleFieldCustom',
  state: {},

  effects: {
    *fetchMainEnterOperateList({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(mainEnterOperateList, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchMoveField({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(moveField, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchAddField({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(addField, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchUpdateField({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(updateField, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchFieldDelete({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(fieldDelete, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchDisplayOrRequired({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(displayOrRequired, { ...params });
      isFunction(callback) && callback(response);
    },
    *reportDataDetailOperateList({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(reportDataDetailOperateList, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchReportLis({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(reportLis, { ...params });
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
    changeData(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

export default IndexModel;
