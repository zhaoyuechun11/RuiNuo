import { Effect, ImmerReducer, Reducer, Subscription } from 'umi';
import {
  getRemoteList,
  getTodayNum,
  getWillInterview,
  getResumeList,
  getOfferList,
  getEditionList,
  getEntryList,
} from './server';

const IndexModel = {
  namespace: 'WorkPlatform',
  state: {
    numInfo: {},
    interviewList: [],
    resumeList: [],
    offerList: [],
    editionList: [],
    entryList: [],
  },

  effects: {
    *getRemoteList(action, { put, call }) {
      const data = yield call(getRemoteList, action.payload);
    },
    *getTodayNum({ payload: { callback, ...params } }, { put, call }) {
      const res = yield call(getTodayNum, params);
      yield put({
        type: 'save',
        payload: {
          type: 'numInfo',
          dataSource: res.data,
        },
      });
    },
    *getWillInterview({ payload: { callback, ...params } }, { put, call }) {
      const res = yield call(getWillInterview, params);
      yield put({
        type: 'save',
        payload: {
          type: 'interviewList',
          dataSource: res.data.list,
        },
      });
    },
    *getResumeList({ payload: { callback, ...params } }, { put, call }) {
      const res = yield call(getResumeList, params);
      yield put({
        type: 'save',
        payload: {
          type: 'resumeList',
          dataSource: res.data.list,
        },
      });
    },
    *getOfferList({ payload: { callback, ...params } }, { put, call }) {
      const res = yield call(getOfferList, params);
      yield put({
        type: 'save',
        payload: {
          type: 'offerList',
          dataSource: res.data.list,
        },
      });
    },
    *getEditionList({ payload: { callback, ...params } }, { put, call }) {
      const res = yield call(getEditionList, params);
      yield put({
        type: 'save',
        payload: {
          type: 'editionList',
          dataSource: res.data.list,
        },
      });
    },
    *getEntryList({ payload: { callback, ...params } }, { put, call }) {
      const res = yield call(getEntryList, params);
      yield put({
        type: 'save',
        payload: {
          type: 'entryList',
          dataSource: res.data,
        },
      });
    },
  },
  reducers: {
    save(state, { payload: { type, dataSource, dateList } }) {
      return {
        ...state,
        [type]: dataSource,
      };
    },
  },
};

export default IndexModel;
