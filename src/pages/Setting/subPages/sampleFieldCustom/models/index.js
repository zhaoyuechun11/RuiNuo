import isFunction from 'lodash/isFunction';
import {
  mainEnterOperateList,
  moveField,
  addField,
  updateField,
  fieldDelete,
  displayOrRequired,
} from './server';
const IndexModel = {
  namespace: 'sampleFieldCustom',
  state: {},

  effects: {
    // *showCodeStatus({ payload }, { call, put }) {
    //   const res = yield call(showCodeStatusApi, { ...payload });
    //   if (res.status_code == 200) {
    //     const checked = res.data.is_fill_registration == 1 ? true : false;
    //     const response = yield call(signCodeApi, {
    //       type: res.data.is_fill_registration,
    //     });
    //     if (response.status_code == 200) {
    //       yield put({
    //         type: 'changeData',
    //         payload: {
    //           checked: checked,
    //           codeInfo: response.data,
    //         },
    //       });
    //     } else {
    //       message.error(res.message);
    //     }
    //   }
    // },
    // *signCode({ payload }, { call, put }) {
    //   const response = yield call(signCodeApi, { ...payload });
    //   if (response.status_code == 200) {
    //     yield put({
    //       type: 'changeData',
    //       payload: {
    //         checked: payload.type == 2 ? false : true,
    //         codeInfo: response.data,
    //       },
    //     });
    //   } else {
    //     message.error(res.message);
    //   }
    // },
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
