import isFunction from 'lodash/isFunction';
const IndexModel = {
  namespace: 'PreProcessingMag',
  state: {
    columnData: [], //表头数据
  },
  // 添加操作者自定义表头
  *saveCustomHeader({ payload }, { call, put }) {
    let response = yield call(saveCustomHeader, payload);
    let { callback } = payload;
    let { status_code = '' } = response;
    if (status_code * 1 === 200) {
      isFunction(callback) && callback();
    }
  },
  // 获取自定义表头
  *getCustomHeader({ payload: { callback, ...params } }, { put, call }) {
    const res = yield call(getCustomHeader, params);
    const data1 = res.data == null ? null : res.data.json ? JSON.parse(res.data.json) : null;
    if (res.status_code * 1 === 200) {
      isFunction(callback) && callback(data1);
    }
    yield put({
      type: 'save',
      payload: {
        type: 'columnData',
        dataSource: data1,
      },
    });
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
