import isFunction from 'lodash/isFunction';
import {
  saveCustomHeader,
  showCustomHeader,
  mainEnterOperateList,
  mainEnterEnterList,
  reqMainOrder,
  getMainOrder,
  getApplicationForm,
  pageForReqMainEnter,
  reportItems,
  examineDataCustomHeader,
  scanSorting,
  sortingList,
  waitBlood,
  finishBlood,
  scanBlood,
} from './server';

const preProcessingMag = {
  namespace: 'preProcessingMag',
  state: {
    columnData: [], //表头数据
    sampleList: [],
    information: [],
    pageNum: 1,
    scanSortData: [],
    scanBloodData: [],
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
    *getExamineCustomHeader({ payload: { callback, ...params } }, { put, call }) {
      const res = yield call(examineDataCustomHeader, params);
      if (res.code * 1 === 200) {
        isFunction(callback) && callback(res);
      }
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
    *getMainOrder({ payload: { callback, ...params } }, { put, call }) {
      const res = yield call(getMainOrder, params);
      if (res.code * 1 === 200) {
        isFunction(callback) && callback(res);
      }
    },
    *feactApplicationForm({ payload: { callback, ...params } }, { put, call }) {
      const res = yield call(getApplicationForm, params);
      if (res.code * 1 === 200) {
        isFunction(callback) && callback(res);
      }
    },
    *fetchPageForReqMainEnter({ payload: { callback, ...params } }, { put, call }) {
      const res = yield call(pageForReqMainEnter, params);
      if (res.code * 1 === 200) {
        isFunction(callback) && callback(res);
      }
    },
    *fetchReportItems({ payload: { callback, ...params } }, { put, call }) {
      const res = yield call(reportItems, params);
      if (res.code * 1 === 200) {
        isFunction(callback) && callback(res);
      }
    },
    *fetchScanSorting({ payload: { callback, ...params } }, { put, call }) {
      const res = yield call(scanSorting, params);
      if (res.code * 1 === 200) {
        isFunction(callback) && callback(res);
      }
    },
    *fetchSortingList({ payload: { callback, ...params } }, { put, call }) {
      const res = yield call(sortingList, params);
      if (res.code * 1 === 200) {
        isFunction(callback) && callback(res);
      }
    },
    *fetchWaitBlood({ payload: { callback, ...params } }, { put, call }) {
      const res = yield call(waitBlood, params);
      if (res.code * 1 === 200) {
        isFunction(callback) && callback(res);
      }
    },
    *fetchFinishBlood({ payload: { callback, ...params } }, { put, call }) {
      const res = yield call(finishBlood, params);
      if (res.code * 1 === 200) {
        isFunction(callback) && callback(res);
      }
    },
    *fetchScanBlood({ payload: { callback, ...params } }, { put, call }) {
      const res = yield call(scanBlood, params);
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
