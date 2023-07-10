import isFunction from 'lodash/isFunction';
import {
  saveCustomHeader,
  showCustomHeader,
  mainEnterOperateList,
  mainEnterEnterList,
  reqMainOrder
} from './server';

const preProcessingMag = {
  namespace: 'preProcessingMag',
  state: {
    columnData: [], //表头数据
  },

  effects: {
    // 添加操作者自定义表头
    *saveCustomHeader({ payload }, { call, put }) {
      let response = yield call(saveCustomHeader, payload);
      let { callback } = payload;
      let { code = '' } = response;
      if (code * 1 === 200) {
        isFunction(callback) && callback(response);
      }
    },
    // 获取自定义表头
    *getCustomHeader({ payload: { callback, ...params } }, { put, call }) {
      const res = yield call(showCustomHeader, params);
      if (res.code * 1 === 200) {
        isFunction(callback) && callback(res);
      }
      yield put({
        type: 'save',
        payload: {
          type: 'columnData',
          dataSource: res.data,
        },
      });
    },
    *getMainEnterOperateList({ payload: { callback, ...params } }, { put, call }) {
      const res = yield call(mainEnterOperateList, params);
      if (res.code * 1 === 200) {
        isFunction(callback) && callback(res);
      }
    },
    *getMainEnterEnterList({ payload: { callback, ...params } }, { put, call }) {
      const res = yield call(mainEnterEnterList, params);
      if (res.code * 1 === 200) {
        isFunction(callback) && callback(res);
      }
    },
    *getReqMainOrder({ payload: { callback, ...params } }, { put, call }) {
      const res = yield call(reqMainOrder, params);
      if (res.code * 1 === 200) {
        isFunction(callback) && callback(res);
      }
    },
  },
  reducers: {
    save(state, { payload: { type, dataSource } }) {
      return {
        ...state,
        [type]: dataSource,
      };
    },

    saveMore(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
export default preProcessingMag;
