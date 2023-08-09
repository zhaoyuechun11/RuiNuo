import { paramsSetList, mainEnterPage,mainEnterPageDele } from './server';
import isFunction from 'lodash/isFunction';
const IndexModel = {
  namespace: 'Setting',
  state: {},
  effects: {
    *fetchParamsSetList({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(paramsSetList, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchMainEnterPage({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(mainEnterPage, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchMainEnterPageDele({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(mainEnterPageDele, { ...params });
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

export default IndexModel;
