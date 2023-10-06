import isFunction from 'lodash/isFunction';
const reportMag = {
  namespace: 'reportMag',
  state: {},
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
export default reportMag;
