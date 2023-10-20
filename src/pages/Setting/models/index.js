import {
  paramsSetList,
  mainEnterPage,
  mainEnterPageDele,
  reportMainDataPage,
  mainEnterPageAdd,
  addReportMainData,
  mainEnterPageUpdate,
  updateDefault,
  updateReportDataDefault,
  reportMainDataDetailPage,
  addReportMainDataDetail,
  updateReportDataDetailDefault,
  reportMainDataOperateList,
  reportMainDataListPage,
  reportListDefaultUpdate,
  reportListModalAdd,
  inputTemplate,
  inputTemplateAdd,
  inputTemplateUpdate,
  inputTemplateDelete,
  inputTemplateDetail,
  inputTemplateDetailAdd,
  inputTemplateDetailUpdate,
  wordEntry,
  wordEntryAdd,
  wordEntryUpdate,
  wordEntryDelete,
  wordEntryChange,
  reportComQueryListPage,
  reportComQueryListPageAdd,
  reportComQueryListPageDefault,
} from './server';
import isFunction from 'lodash/isFunction';
const IndexModel = {
  namespace: 'Setting',
  state: {
    reportTempleName: '',
    processXml: '',
    processFormData: {},
    processRecordId: '',
    bpmnModeler: null,
  },
  effects: {
    *fetchParamsSetList({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(paramsSetList, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchMainEnterPage({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(mainEnterPage, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchMainEnterPageDele({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(mainEnterPageDele, { ...params });
      isFunction(callback) && callback(response);
    },
    *reportMainDataPage({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(reportMainDataPage, { ...params });
      isFunction(callback) && callback(response);
    },
    *mainEnterPageAdd({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(mainEnterPageAdd, { ...params });
      isFunction(callback) && callback(response);
    },
    *addReportMainData({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(addReportMainData, { ...params });
      isFunction(callback) && callback(response);
    },
    *mainEnterPageUpdate({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(mainEnterPageUpdate, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchMainEnterDefault({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(updateDefault, { ...params });
      isFunction(callback) && callback(response);
    },
    *updateReportDataDefault({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(updateReportDataDefault, { ...params });
      isFunction(callback) && callback(response);
    },
    *reportMainDataDetailPage({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(reportMainDataDetailPage, { ...params });
      isFunction(callback) && callback(response);
    },
    *addReportMainDataDetail({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(addReportMainDataDetail, { ...params });
      isFunction(callback) && callback(response);
    },
    *updateReportDataDetailDefault({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(updateReportDataDetailDefault, { ...params });
      isFunction(callback) && callback(response);
    },
    *reportMainDataOperateList({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(reportMainDataOperateList, { ...params });
      isFunction(callback) && callback(response);
    },
    *reportMainDataListPage({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(reportMainDataListPage, { ...params });
      isFunction(callback) && callback(response);
    },
    *reportListDefaultUpdate({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(reportListDefaultUpdate, { ...params });
      isFunction(callback) && callback(response);
    },
    *reportListModalAdd({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(reportListModalAdd, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchInputTemplate({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(inputTemplate, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchInputTemplateAdd({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(inputTemplateAdd, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchInputTemplateUpdate({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(inputTemplateUpdate, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchInputTemplateDelete({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(inputTemplateDelete, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchInputTemplateDetail({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(inputTemplateDetail, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchInputTemplateDetailAdd({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(inputTemplateDetailAdd, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchInputTemplateDetailUpdate({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(inputTemplateDetailUpdate, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchWordEntry({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(wordEntry, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchWordEntryAdd({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(wordEntryAdd, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchWordEntryUpdate({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(wordEntryUpdate, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchWordEntryDelete({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(wordEntryDelete, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchWordEntryChange({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(wordEntryChange, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchReportComQueryList({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(reportComQueryListPage, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchReportComQueryAdd({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(reportComQueryListPageAdd, { ...params });
      isFunction(callback) && callback(response);
    },
    *fetchReportComQueryDefault({ payload }, { call }) {
      const { callback, ...params } = payload;
      const response = yield call(reportComQueryListPageDefault, { ...params });
      isFunction(callback) && callback(response);
    },
  },
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
