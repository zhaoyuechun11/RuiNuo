import { getQCList, QCItemList, controlsItemStatusChange } from './server';

import isFunction from 'lodash/isFunction';
const indoorQualityControMsg = {
  namespace: 'indoorQualityControMsg',
  state: {},
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
};
export default indoorQualityControMsg;
