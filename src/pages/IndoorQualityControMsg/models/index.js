import { getQCList, QCItemList, controlsItemStatusChange } from './server';

import isFunction from 'lodash/isFunction';
const IndoorQualityControMsg = {
  namespace: 'IndoorQualityControMsg',
  state: {
    leftMenuParams: {},
    selectedInstr: {},
    leftMenuParamsRules: {},
    leftMenuParamsDCRules: {},
    collectionControl: {},
    dataMaintenance: {},
    dataMaintenanceInstr: {},
    AWSelectedQcIds: [],
    AWItem: '',
    AWFormData: {},
    AWQcList: [],
    AWGraphicalData: {},
  },
  effects: {
    *fetchQCList({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(getQCList, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchQCItemList({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(QCItemList, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchControlsItemStatusChange({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(controlsItemStatusChange, { ...params });
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
export default IndoorQualityControMsg;
