import {
  globalSearch,
} from './server';
import isFunction from 'lodash/isFunction';
let role_type = localStorage.getItem('role_type_arr');
let router_from = undefined;

const initialSearchList = [
  {
    // icon: require('../layouts/components/Header/img/name.png'),
    label: '姓名',
    value: '',
    key: 'name',
  },
  {
    // icon: require('../layouts/components/Header/img/phone.png'),
    label: '电话',
    value: '',
    key: 'phone',
  },
  {
    // icon: require('../layouts/components/Header/img/email.png'),
    label: '邮箱',
    value: '',
    key: 'email',
  },
  {
    // icon: require('../layouts/components/Header/img/company.png'),
    label: '公司',
    value: '',
    key: 'work_place',
  },
  {
    // icon: require('../layouts/components/Header/img/position.png'),
    label: '职位',
    value: '',
    key: 'position',
  },
  {
    // icon: require('../layouts/components/Header/img/school.png'),
    label: '学校',
    value: '',
    key: 'graduate',
  },
];

export default {
  namespace: 'global',

  state: {
    role_type,

    positionList: [], // 不需要展示删除职位的数据
    positionDeleteList: [], // 展示删除职位的数据
    departmentList: [], // 不需要展示删除部门的数据
    departmentOneList: [], // 获取一维部门列表
    channelsList: [], // 渠道列表
    educationList: [], // 学历列表
    sendEmailList: [], // 发送邮箱列表
    eliminateReasonList: [], // 淘汰原因列表
    giveUpReasonsList: [], // 放弃入职原因列表
    contactList: [], // 联系人信息列表
    tagList: [], // 标签列表
    operatorList: [], // 操作人列表
    interviewerList: [],
    companyInfo: {
      operator: {
        name: '',
      },
    },
    enterInfo: {},
    noticeInfo: {},
    headerShow: true,

    defaultObj: {
      // 默认的新手引导的值
      candidateStep: 0,
      recruitmentStep: 0,
      talenterStep: 0,
      calendarStep: 0,
      settingStep: 0,
      candidateDetailStep: 0,
      interviewStep: 0,
      resumeStep: 0,
      workStep: 0,
    },
    navCurrentKey: '',
    showNav: false,
    longSearch: false, //全局搜索候选搜索框
    selectValue: [], //全局搜索候选人选中z值
    selectOption: [], //全局搜索候选人选中条件
    globalSearchParams: null, //全局搜索候选人筛选条件
    globalSearchList: { count: 0, list: [] }, //全局搜索候选人数据
    searchList: initialSearchList,
  },

  effects: {
    *globalSearch({ payload: { callback, dataSource } }, { put, call }) {
      const res = yield call(globalSearch, dataSource);
      isFunction(callback) && callback(res.data);
      yield put({
        type: 'save',
        payload: {
          type: 'globalSearchList',
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
            payload: {
              headerShow: role_type.length == 1 && role_type[0] == '3' ? false : true,
            },
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
              searchList: initialSearchList,
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
              //localStorage.setItem('candidate_scroll', document.documentElement.scrollTop);
            } else {
              localStorage.removeItem('candidate_scroll');
            }
          }
        } else {
          // 切换出候选人模块时，删除滚动条
          localStorage.removeItem('candidate_scroll');
        }

        // 人才库模块
        if (router.pathname.indexOf(/talenter/) > -1) {
          if (router_from && router_from === '/talenter/index') {
            if (router.pathname === '/talenter/detail') {
              localStorage.setItem('talenter_scroll', document.documentElement.scrollTop);
            } else {
              localStorage.removeItem('talenter_scroll');
            }
          }
        } else {
          // 切换出人才库模块时，删除滚动条
          localStorage.removeItem('talenter_scroll');
        }
        router_from = router.pathname;
      });
    },
  },

  reducers: {
    save(state, { payload: { type, dataSource } }) {
      //
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
      //
      return {
        ...state,
        stepObj: { ...state.stepObj, ...payload },
      };
    },
  },
};
