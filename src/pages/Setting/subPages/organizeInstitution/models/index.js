import {
  getRoleIndex, //角色列表
  roleAdd, //新增角色
  roleEdit, //编辑角色
  roleDel, //删除角色
} from './server';
import isFunction from 'lodash/isFunction';
export default {
  namespace: 'role',
  state: {
    rolelistData: {}, //角色列表数据
    assignList: [], //已分配角色列表
  },
  effects: {
    *fetchRoleIndex({ payload }, { call, put }) {
      let response = yield call(getRoleIndex, payload);
      let { code = '' } = response;
      let { callback } = payload;
      if (code * 1 === 200) {
        let parseJson = (arr) => {
          arr = arr?.slice();
          function toParse(arr) {
            arr.forEach(function (item) {
              if (item.children && Array.isArray(item.children)) {
                item['key'] = item.id;
                item['value'] = item.id;
                item['title'] = item.name;
                item.children.forEach((j) => {
                  j.key = j.id;
                  j.value = j.id;
                  j.title = j.name;
                });
                toParse(item['children']);
              }
              item.key = item.id;
              item.value = item.id;
              item.title = item.name;
            });
            return arr;
          }
          return toParse(arr);
        };
        let list = parseJson(response.data.records);
        let payloadData = {
          list,
          total:response.data.total
        };
        yield put({
          type: 'saveRoleList',
          payload: payloadData,
        });
        isFunction(callback) && callback();
      }
    },
    *fetchRoleAssign({ payload }, { call, put }) {
      let response = yield call(getParentIndex, payload);
      let { status_code = '' } = response;
      let { callback } = payload;
      if (status_code * 1 === 200) {
        let parseJson = (arr) => {
          arr = arr.slice();
          function toParse(arr) {
            arr.forEach(function (item) {
              if (item.children && Array.isArray(item.children)) {
                item['key'] = item.id;
                item['value'] = item.id;
                item['title'] = item.name;
                item.children.forEach((j) => {
                  j.key = j.id;
                  j.value = j.id;
                  j.title = j.name;
                });
                toParse(item['children']);
              }
              item.key = item.id;
              item.value = item.id;
              item.title = item.name;
            });
            return arr;
          }
          return toParse(arr);
        };
        yield put({
          type: 'saveAssign',
          payload: parseJson(response.data),
        });
        isFunction(callback) && callback();
      }
    },
    *addRole({ payload }, { call, put }) {
      let response = yield call(roleAdd, payload);
      let { code = '' } = response;
      let { callback } = payload;
      if (code * 1 === 200) {
        isFunction(callback) && callback(response.data);
      }
    },
    *editRole({ payload }, { call, put }) {
      let response = yield call(roleEdit, payload);
      let { code = '' } = response;
      let { callback } = payload;
      if (code * 1 === 200) {
        isFunction(callback) && callback();
      }
    },
    *delRole({ payload }, { call, put }) {
      let response = yield call(roleDel, payload);
      let { code = '' } = response;
      let { callback } = payload;
      if (code * 1 === 200) {
        isFunction(callback) && callback();
      }
    },
  },
  reducers: {
    saveRoleList(state, action) {
      return {
        ...state,
        rolelistData: action.payload,
      };
    },
    saveAssign(state, action) {
      return {
        ...state,
        assignList: action.payload,
      };
    },
  },
};
