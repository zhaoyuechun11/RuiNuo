
import { paramsSetList } from './server';
import isFunction from 'lodash/isFunction';
const IndexModel = {
  namespace: 'Setting',
  state: {

  }, // 仓库初始值
  effects: {
    *fetchParamsSetList({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(paramsSetList, { ...params });
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
