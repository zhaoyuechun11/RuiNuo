import { showCodeStatusApi, signCodeApi } from './server';

const IndexModel = {
  namespace: 'standardResume',
  state: {
    checked: false, //tabheader 数据
    codeInfo: {},
  },

  // effects: {
  //   *showCodeStatus({ payload }, { call, put }) {
  //     const res = yield call(showCodeStatusApi, { ...payload });
  //     if (res.status_code == 200) {
  //       const checked = res.data.is_fill_registration == 1 ? true : false;
  //       const response = yield call(signCodeApi, {
  //         type: res.data.is_fill_registration,
  //       });
  //       if (response.status_code == 200) {
  //         yield put({
  //           type: 'changeData',
  //           payload: {
  //             checked: checked,
  //             codeInfo: response.data,
  //           },
  //         });
  //       } else {
  //         message.error(res.message);
  //       }
  //     }
  //   },
  //   *signCode({ payload }, { call, put }) {
  //
  //     const response = yield call(signCodeApi, { ...payload });
  //     if (response.status_code == 200) {
  //       yield put({
  //         type: 'changeData',
  //         payload: {
  //           checked: payload.type == 2 ? false : true,
  //           codeInfo: response.data,
  //         },
  //       });
  //     } else {
  //       message.error(res.message);
  //     }
  //   },
  // },
  // reducers: {
  //   save(state, { payload: { type, dataSource } }) {
  //     return {
  //       ...state,
  //       [type]: dataSource,
  //     };
  //   },
  //   changeData(state, action) {
  //     return {
  //       ...state,
  //       ...action.payload,
  //     };
  //   },
  // },
};

export default IndexModel;
