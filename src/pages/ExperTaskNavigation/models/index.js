import isFunction from 'lodash/isFunction';
const ExperTaskNavigation = {
  namespace: 'experTaskNavigation',
  state: {
    nodeList: [],
  },
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
export default ExperTaskNavigation;
