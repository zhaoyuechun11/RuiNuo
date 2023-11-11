import isFunction from 'lodash/isFunction';

const HandoverMsg = {
  namespace: 'HandoverMsg',
  state: {
    tabButtonData: [],
    leftMenuParams: {},
  },
  effects: {
    *initTabButton({ payload }, { call, put }) {
      yield put({
        type: 'saveTabButton',
        payload: payload.data,
      });
    },
    *changeTabButton({ payload }, { call, put }) {
      let { index, tabButtonData, callback } = payload;
      tabButtonData.forEach((i) => {
        i.active = false;
      });
      tabButtonData[index].active = true;
      yield put({
        type: 'changeTabButtonActive',
        payload: tabButtonData,
      });
      isFunction(callback) && callback(tabButtonData[index]);
    },
  },
  reducers: {
    changeTabButtonActive(state, action) {
      return {
        ...state,
        tabButtonData: action.payload,
      };
    },
    saveTabButton(state, action) {
      return {
        ...state,
        tabButtonData: action.payload,
      };
    },
    save(state, { payload: { type, dataSource } }) {
      return {
        ...state,
        [type]: dataSource,
      };
    },
  },
};
export default HandoverMsg;
