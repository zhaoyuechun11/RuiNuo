import { Effect, ImmerReducer, Reducer, Subscription } from 'umi';
import { getRemoteList } from './server';

const IndexModel = {
  namespace: 'Setting',
  state: {
    open_employment: true, // 是否开启审批功能
  }, // 仓库初始值
  effects: {},
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
