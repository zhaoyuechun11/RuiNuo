import axiosBase from '@utils/http';
export function getRemoteList(params) {
  return axiosBase('/apiweb/edition/notice', 'post', params);
}

// 今日数据统计
export function getTodayNum(params) {
  return axiosBase('/apiweb/statistic/todayNum', 'get', params);
}

// 待面试列表
export function getWillInterview(params) {
  return axiosBase('/apiweb/statistic/nextInterviewList', 'get', params);
}

// 筛简历列表
export function getResumeList(params) {
  return axiosBase('/apiweb/statistic/resumeList', 'get', params);
}

// 待沟通Offer列表
export function getOfferList(params) {
  return axiosBase('/apiweb/statistic/allProcessPassList', 'get', params);
}

// 公告列表
export function getEditionList(params) {
  return axiosBase('/apiweb/statistic/editionList', 'get', params);
}

// 待入职列表
export function getEntryList(params) {
  return axiosBase('/apiweb/statistic/nextEntryList', 'get', params);
}

// 邮箱同步简历信息
export function getStatistic(params) {
  return axiosBase('apiweb/statistic/emailUserStatistic', 'get', params);
}

// 小易助手待办事项
export function getPending(params) {
  return axiosBase('/apiweb/statistic/pending', 'get', params);
}

export function addSuggest(params) {
  return axiosBase('/apiweb/operator/suggest', 'post', params)
}
// 查看公司试用期是否到期
export function getExpireInfo(params) {
  return axiosBase('/apiweb/enterprise/getExpireInfo', 'get', params)
}