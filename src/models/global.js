import { userDetail } from './server';
import isFunction from 'lodash/isFunction';
let router_from = undefined;
export default {
  namespace: 'global',
  state: {
    headerShow: true,
    globalSearchParams: null, //全局搜索候选人筛选条件
    useDetail: { }, //全局搜索候选人数据
   
  },

  effects: {
    *fetchUserDetail({ payload: { callback, dataSource } }, { put, call }) {
      const res = yield call(userDetail, dataSource);
      isFunction(callback) && callback(res.data);
      yield put({
        type: 'save',
        payload: {
          type: 'useDetail',
          dataSource: res.data,
        },
      });
    },
  },

  subscriptions: {
    set({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        let interviewNum = pathname.indexOf('/interview/index') > -1;
        let resumeNum = pathname.indexOf('/resume/index') > -1;
        let canDetailNum =
          pathname.indexOf('/candidate/detail') > -1 ||
          pathname.indexOf('/resume/detail') > -1 ||
          pathname.indexOf('interview/detail') > -1;
        if (canDetailNum) {
          dispatch({
            type: 'setState',
          
          });
        } else {
          dispatch({
            type: 'setState',
            payload: {
              headerShow: interviewNum || resumeNum ? false : true,
            },
          });
        }
        if (pathname.indexOf('/workPlatform/searchResult') < 0) {
          dispatch({
            type: 'setState',
            payload: {
              longSearch: false,
              selectValue: [],
              selectOption: [],
   
              globalSearchParams: null,
              globalSearchList: { count: 0, list: [] },
            },
          });
        }
      });
    },

    set_scroll({ dispatch, history }) {
      history.listen((router) => {
        // 候选人模块
        if (router.pathname.indexOf(/candidate/) > -1) {
          // 从候选人列表页跳转到详情页，保存滚动条为止
          if (router_from && router_from === '/candidate/index') {
            if (router.pathname === '/candidate/detail') {
            
            } else {
              localStorage.removeItem('candidate_scroll');
            }
          }
        } else {
          // 切换出候选人模块时，删除滚动条
     
        }

        // 人才库模块
        if (router.pathname.indexOf(/talenter/) > -1) {
          if (router_from && router_from === '/talenter/index') {
            if (router.pathname === '/talenter/detail') {
            
            } else {
        
            }
          }
        } else {
          // 切换出人才库模块时，删除滚动条
   
        }
        router_from = router.pathname;
      });
    },
  },

  reducers: {
    save(state, { payload: { type, dataSource } }) {
      return {
        ...state,
        [type]: dataSource,
      };
    },
    saveMoreData(state, payload) {
      return {
        ...state,
        ...payload.payload,
      };
    },
    setState(state, { payload }) {
      return Object.assign({}, state, { ...payload });
    },
    setStepNum(state, { payload }) {
      return {
        ...state,
        stepObj: { ...state.stepObj, ...payload },
      };
    },
  },
};
