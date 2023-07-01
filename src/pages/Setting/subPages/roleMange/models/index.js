import {
  getAuthDepartment, //获取公司组织架构数据
  getMemberList, //获取公司人员列表
  getRoleAssign, //已分配角色列表
  RoleAssignStore, //单个员工分配角色
  RoleAssignBatch, //批量分配角色
  getRoleList, //获取角色列表
  changeAuth, //授权
  getShareData, //获取共享人数据列表
  getSelectShareData, //已选择的共享人数据
  saveShareId, //保存已选择的人员
  getOperatorList, //获取接收负责人数据
  cancelAuth, // 交接人下岗位列表及对应用户数据
} from './server';
import isFunction from 'lodash/isFunction';
import { message } from 'antd';

export default {
  namespace: 'rolemanage',
  state: {
    authDepartment: [], //公司组织架构数据
    memberlistData: {
      list: [],
      account_num: 0,
      pay_status: 0,
      pagenation: {},
    }, //公司人员列表数据
    roleassign: [], //已分配角色数据
    admin: {}, //
    roleList: [], //角色列表
    shareList: [], //共享人数据
    selectShareList: [], //已选择的共享人数据
    operatorList: [], //接收负责人数据
    positionlistData: {
      list: [],
      pagenation: {},
    }, //获取职位列表数据
    availablePositionList: {
      list: [],
      pagenation: {},
    },
  },
  effects: {
    *fetchAuthDepartment({ payload }, { call, put }) {
      let { callback, ...others } = payload;
      let response = yield call(getAuthDepartment, { ...others });
      let { status_code = '' } = response;
      if (status_code * 1 === 200) {
        let parseJson = (arr) => {
          arr = arr.slice();
          function toParse(arr) {
            arr.forEach(function (item) {
              if (item.children && Array.isArray(item.children)) {
                item.children.forEach((j) => {
                  j.title = j.name;
                  j.key = j.dept_id;
                });
                toParse(item['children']);
              }
              item.title = item.name;
              item.key = item.dept_id;
            });
            return arr;
          }
          return toParse(arr);
        };
        yield put({
          type: 'saveAuthDepartment',
          payload: parseJson(response.data),
        });
        isFunction(callback) && callback();
      }
    },
    *fetchMemberList({ payload }, { call, put }) {
      let { callback, ...others } = payload;
      let response = yield call(getMemberList, others);

      let { code = '' } = response;
      console.log('response', response);
      if (code * 1 === 200) {
        const { records = [], total = 0, account_num = 0, pay_status = 0 } = response.data || {};
        const { page, page_size } = payload;
        records.forEach((item) => {
          item.roleList = item?.roles?.map((i) => {
            return { name: i.name, id: i.pivot.role_id, type: i.type || '' };
          });
          item.rolesId = item?.roles?.map((i) => i.pivot.role_id);
          item.key = item.id;

          (item.department = item?.department?.join(',')), //==> "depart1, depart2"
            (item.roles = item?.roles?.map((i) => i.name).join(',')); // ==>"name1,name2"
        });
        const payloadData = {
          list: records,
          account_num,
          pay_status,
          pagination: {
            total,
            current: page,
            pageSize: page_size,
          },
        };
     
        yield put({
          type: 'saveMemberList',
          payload: payloadData,
        });
        isFunction(callback) && callback(response.data);
      }
    },
    *fetchRoleAssign({ payload }, { call, put }) {
      let { callback, ...others } = payload;
      let response = yield call(getRoleAssign, others);
      let { status_code = '' } = response;
      if (status_code * 1 === 200) {
        yield put({
          type: 'saveRoleAssign',
          payload: {
            admin: response.data.admin,
            list: response.data.list,
            ...others,
          },
        });
        isFunction(callback) && callback();
      }
    },
    *fetchAssignStore({ payload }, { call, put }) {
      let { callback, ...others } = payload;
      let response = yield call(RoleAssignStore, others);
      let { status_code = '' } = response;
      // if (status_code * 1 === 200) {
      //   isFunction(callback) && callback();
      // }
      isFunction(callback) && callback(response);
    },
    *fetchAssignBatch({ payload }, { call, put }) {
      let { callback, ...others } = payload;
      let response = yield call(RoleAssignBatch, others);
      let { status_code = '' } = response;
      // if (status_code * 1 === 200) {
      //   isFunction(callback) && callback();
      // }
      isFunction(callback) && callback(response);
    },
    *fetchRoleList({ payload }, { call, put }) {
      let { callback, ...others } = payload;
      let response = yield call(getRoleList, others);
      let { code = '' } = response;
      if (code * 1 === 200) {
        yield put({
          type: 'saveRoleList',
          payload: response.data.records,
        });
        isFunction(callback) && callback();
      }
    },
    *fetchChangeAuth({ payload }, { call, put }) {
      let { callback, ...others } = payload;
      let response = yield call(changeAuth, others);
      let { code = '' } = response;
      // if (status_code * 1 === 200) {
      //   isFunction(callback) && callback();
      // }
      isFunction(callback) && callback(response);
    },
    *fetchShareData({ payload }, { call, put }) {
      let { callback, ...others } = payload;
      let response = yield call(getShareData, others);
      let { status_code = '' } = response;
      if (status_code * 1 === 200) {
        yield put({
          type: 'saveShareData',
          payload: response.data.list,
        });
        isFunction(callback) && callback(response.data.list);
      }
    },
    *changeSaveShareData({ payload }, { call, put }) {
      let { index, shareList } = payload;
      yield put({
        type: 'saveShareData',
        payload: shareList.filter((i, ind) => ind !== index),
      });
    },
    *fetchSelectShare({ payload }, { call, put }) {
      let { callback, ...others } = payload;
      let response = yield call(getSelectShareData, others);
      let { status_code = '' } = response;
      if (status_code * 1 === 200) {
        yield put({
          type: 'saveSelectShare',
          payload: response.data.list,
        });
        isFunction(callback) && callback();
      }
    },
    *changeSelectShare({ payload }, { call, put }) {
      let { callback, ...others } = others;
      yield put({
        type: 'saveSelectShare',
        payload: data,
      });
      isFunction(callback) && callback();
    },
    *fetchSaveShareId({ payload }, { call, put }) {
      let { callback, ...others } = payload;
      let response = yield call(saveShareId, { ...others });
      let { status_code = '' } = response;
      if (status_code * 1 === 200) {
        isFunction(callback) && callback();
      }
    },
    *fetchOperatorList({ payload }, { call, put }) {
      let { callback, ...others } = payload;
      let response = yield call(getOperatorList, { ...others });
      let { status_code = '' } = response;
      if (status_code * 1 === 200) {
        yield put({
          type: 'saveOperatorList',
          payload: response.data,
        });
        isFunction(callback) && callback();
      }
    },
    *fetchAvailablePositionList({ payload }, { call, put }) {
      let { callback, ...others } = payload;
      let response = yield call(getAvailablePositionList, { ...others });
      let { status_code = '' } = response;
      if (status_code * 1 === 200) {
        const { list = [], count = 0 } = response.data || {};
        const { page, page_size } = payload;
        list.forEach((item) => {
          item.key = item.id;
        });
        const payloadData = {
          list,
          pagination: {
            total: count,
            current: page,
            pageSize: page_size,
          },
        };
        yield put({
          type: 'saveAvailablePositionList',
          payload: payloadData,
        });
        isFunction(callback) && callback();
      }
    },
    *transferSave({ payload }, { call, put }) {
      let { callback, ...others } = payload;
      let response = yield call(taskTransferSave, { ...others });
      let { status_code = '' } = response;
      if (status_code * 1 === 200) {
        isFunction(callback) && callback();
      }
    },
    *syncDing({ payload }, { call, put }) {
      let { callback, ...others } = payload;
      let response = yield call(syncAuthChange, { ...others });
      let { status_code = '' } = response;
      if (status_code * 1 === 200) {
        isFunction(callback) && callback();
      }
    },
    *fetchShareDel({ payload }, { call, put }) {
      let { callback, ...others } = payload;
      let response = yield call(sharedel, { ...others });
      let { status_code = '' } = response;
      if (status_code * 1 === 200) {
        isFunction(callback) && callback();
      }
    },
    *bulkCancelAuth({ payload }, { call, put }) {
      const { callback, ...params } = payload;
      const response = yield call(cancelAuth, { ...params });
      const { status_code = '' } = response;
      if (status_code * 1 === 200) {
        isFunction(callback) && callback();
      }
    },
  },
  reducers: {
    saveAuthDepartment(state, action) {
      return {
        ...state,
        authDepartment: action.payload,
      };
    },
    saveMemberList(state, action) {
   
      return {
        ...state,
        memberlistData: action.payload,
      };
    },
    saveRoleAssign(state, action) {
      // is_admin 判断是否是主管理员
      let { is_admin = 0 } = action.payload;
      let parseJson = (arr) => {
        arr = arr.slice();
        function toParse(arr) {
          arr.forEach(function (item) {
            if (item.children && Array.isArray(item.children)) {
              item['children'] = item.children;
              item.children.forEach((j) => {
                j.title = j.name;
                j.value = j.id;
                delete j.key;
              });
              toParse(item['children']);
            }
            if (is_admin === 3 && item.type == 1) {
              item.disabled = true;
            }
            item.title = item.name;
            item.value = item.id;
            delete item.key;
          });
          return arr;
        }
        return toParse(arr);
      };
      let roleassign = parseJson(action.payload.list);
      let isAdmin = action.payload.list.find((i) => i.name === '管理员');
      if (!isAdmin) {
        roleassign.unshift({
          ...action.payload.admin,
          title: action.payload.admin.name,
          value: action.payload.admin.id,
          disabled: true,
          notAdmin: true,
        });
      }
      return {
        ...state,
        roleassign,
      };
    },
    saveRoleList(state, action) {
      return {
        ...state,
        roleList: action.payload,
      };
    },
    saveShareData(state, action) {
      return {
        ...state,
        shareList: action.payload,
      };
    },
    saveSelectShare(state, action) {
      return {
        ...state,
        selectShareList: action.payload,
      };
    },
    saveOperatorList(state, action) {
      return {
        ...state,
        operatorList: action.payload,
      };
    },
    saveAvailablePositionList(state, action) {
      return {
        ...state,
        availablePositionList: action.payload,
      };
    },
    savePositionList(state, action) {
      return {
        ...state,
        positionlistData: action.payload,
      };
    },
  },
};
