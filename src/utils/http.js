import axios from 'axios';
import qs from 'qs';
// import URL from "./env";

import { message } from 'antd';
import { history } from 'umi';
axios.defaults.timeout = 600000;
// axios.defaults.baseURL = URL.apiurl_one;
axios.defaults.baseURL = process.env.baseURL;

// ---------------------------------（解决重复点击事件的问题）start----------------------
let pending = []; //声明一个数组用于存储每个ajax请求的取消函数和ajax标识
let cancelToken = axios.CancelToken;
let removePending = (ever) => {
  for (let p in pending) {
    // 重复请求取消例外条件
    if (
      // ever.url.indexOf('/apiweb/Talents/batchToLeadResume') > -1 ||
      // ever.url.indexOf('/apiweb/user/addInterviewUserByFile') > -1 ||
      // ever.url.indexOf('/apiweb/user/addInterviewUserByOneFile') > -1 ||
      // ever.url.indexOf('/api/email/getBindingsList') > -1 ||
      // ever.url.indexOf('/apiweb/email/getBindingsList') > -1 ||
      // ever.url.indexOf('/apiweb/approve/uploadChunk') > -1 ||
      // ever.url.indexOf('/apiweb/interviewInfo/interviewArrangeList') > -1 ||
      // ever.url.indexOf('/apiweb/user/license') > -1 ||
      // ever.url.indexOf('/apiweb/Talents/chooseTalent') > -1 ||
      // ever.url.indexOf('/apiweb/position/invitePostList') > -1 ||
      // ever.url.indexOf('/apiweb/interview/config/index') > -1 ||
      // ever.url.indexOf('/apiweb/user/getUserDetail') > -1
      ever.url.indexOf('/basic/dict/getList') > -1 ||
      ever.url.indexOf('lab/reportResultCommon/getSampleNo') > -1 ||
      ever.url.indexOf('lab/reportResultCommon/getList') > -1
    ) {
      return;
    }
    if (pending[p].u === ever.url + '&' + ever.method) {
      //当当前请求在数组中存在时执行函数体
      pending[p].f(); //执行取消操作
      pending.splice(p, 1); //把这条记录从数组中移除
    }
  }
};
// ---------------------------------（解决重复点击事件的问题）end------------------------

// 添加请求拦截器
axios.interceptors.request.use(
  (config) => {
    // 序列化
    if (config.headers['Content-Type'] != 'multipart/form-data') {
      if (
        config.url === 'lab/reqMainSplit/preSort' ||
        config.url === 'lab/reqMainSplit/blood' ||
        config.url === 'lab/reqMainSplit/preTransfer' ||
        config.url === 'lab/reqMainSplit/instrMachineAllocation' ||
        config.url === 'lab/reqMainSplit/manualMachineAllocation' ||
        config.url === 'lab/reportResultCommon/update' ||
        config.url === 'lab/reportResultCommon/save' ||
        config.url === 'lab/reexamineResult/add'
      ) {
        config.data = config.data;
      } else {
        config.data = qs.parse(config.data);
      }

      if (config.method === 'get') {
        config.paramsSerializer = function (params) {
          return qs.stringify(params, { arrayFormat: 'comma' });
        };
      }
    }
    // -----在一个ajax发送前执行一下取消操作-------------------------------------------------------
    removePending(config);
    config.cancelToken = new cancelToken((c) => {
      // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
      pending.push({ u: config.url + '&' + config.method, f: c });
    });
    // -----------------------------------------------------------------------------------------
    // 添加token
    if (!config.url.includes('/sys/user/login')) {
      config.headers.Authorization = `${localStorage.getItem('access_token')}`;
    }
    return config;
  },
  (error) => {
    message.error(error);
    return error;
  },
);

// 添加响应拦截器
axios.interceptors.response.use(
  (res) => {
    // ------------------------------------------------------------------------------------------
    removePending(res.config); //在一个ajax响应后再执行一下取消操作，把已经完成的请求从pending中移除
    // ------------------------------------------------------------------------------------------

    const data = res.data;
    const { status } = res;

    if (data.code === 200 || data.code === 402) {
      return Promise.resolve(res);
    } else if (status === 401) {
      history.push('/login');
      return;
    } else {
      // 后台返回非200状态码做错误提示
      if (toString.call(data) !== '[object Blob]') {
        message.warning(data.msg);
      }
      return Promise.resolve(res);
    }
  },
  (error) => {
    if (String(error) === 'Error: timeout of 60000ms exceeded') {
      message.warning('请求超时！');
    } else if (String(error) === 'Error: Network Error') {
      // message.error("网络出错！")
    }
    return Promise.reject(error);
  },
);

function axiosBase(url, type, params) {
  if (!params) params = {};
  if (
    !url.includes('/apiweb/ding/login') &&
    !url.includes('/apiweb/foreignTradeRecruit/searchConditions')
  ) {
    // params.operator_id =
    //   params.operator_id || localStorage.getItem('operator_id') || global.state.operator_id;
    // params.enterprise_id =
    //   params.enterprise_id || localStorage.getItem('enterprise_id') || global.state.enterprise_id;
    // headers: {
    //     'Authorization':`Bearer ${localStorage.getItem('access_token')}`
    // }
  }

  let export_name;
  let axiosMain;
  if (type.toUpperCase() === 'GET') {
    console.log('url', url.split('/').pop());
    if (
      url.split('/').pop() !== 'export' &&
      url !== '/lab/reqMainOrder/comprehensiveQueryOrderExport' &&
      url !== '/lab/reqMainOrder/comprehensiveQuerySplitExport' &&
      url !== 'lab/reportMain/reportComprehensiveQueryExport' &&
      url !== 'lab/consultRegister/weekStatisticsExport' &&
      url !== 'lab/consultRegister/monthStatisticsExport'
    ) {
      axiosMain = axios.get(url, {
        params: params,
        headers: {
          // 'X-Requested-With': 'XMLHttpRequest',
        },
      });
    } else {
      axiosMain = axios.get(url, {
        params: params,
        headers: {
          // 'X-Requested-With': 'XMLHttpRequest',
        },
        responseType: 'blob',
      });
    }
  } else if (type.toUpperCase() === 'POST') {
    axiosMain = axios.post(url, params, {
      headers: {
        // 'X-Requested-With': 'XMLHttpRequest',
        // contentType: 'application/json',
      },
    });
  } else if (type.toUpperCase() === 'PUT') {
    let id = params.id;
    delete params['id'];
    axiosMain = axios.put(`${url}/${id}`, params, {
      headers: {
        // 'X-Requested-With': 'XMLHttpRequest',
      },
    });
  } else if (type.toUpperCase() === 'PATCH') {
    let id = params.id;
    delete params['id'];
    axiosMain = axios.patch(`${url}/${id}`, params, {
      headers: {
        // 'X-Requested-With': 'XMLHttpRequest',
      },
    });
  } else if (type.toUpperCase() === 'DELETE') {
    let id = params.ids;
    delete params['id'];
    axiosMain = axios.delete(`${url}`, {
      params: params,
      headers: {
        // 'X-Requested-With': 'XMLHttpRequest',
      },
    });
    // axiosMain = axios.delete(`${url}/${id}`, {
    //   params,
    // });
  } else if (type.toUpperCase() === 'OPEN') {
    return window.open(`${url}`);
  } else if (type.toUpperCase() === 'UPLOAD') {
    axiosMain = axios({
      url: `${url}`,
      method: 'post',
      data: params,
      dataType: 'json',
      headers: {
        // 'contentType': false,
        // 'processData': false,
        // 'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'multipart/form-data',
      },
    });
  } else if (type.toUpperCase() === 'DOWNLOAD') {
    params['export'] = 1;
    export_name = params['export_name'];
    delete params['export_name'];
    axiosMain = axios.get(`${url}`, {
      params: params,
      headers: {
        // 'X-Requested-With': 'XMLHttpRequest',
      },
      responseType: 'blob',
    });
  }
  return axiosMain
    .then((res) => {
      if (type.toUpperCase() !== 'DOWNLOAD') {
        return res.data;
      } else {
        let date = `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()}`;
        let blob = new Blob([res.data], {
          type: 'application/x-xlsx',
        });
        let downloadElement = document.createElement('a');
        let href = window.URL.createObjectURL(blob);
        downloadElement.href = href;
        downloadElement.download = `${export_name}_${date}.xlsx`;
        document.body.appendChild(downloadElement);
        downloadElement.click();
        return {
          code: 200,
          data: [],
          msg: ``,
        };
      }
    })
    .catch((err) => {
      //debugger
      return Promise.reject(err);
      if (err.message) {
        return Promise.reject(err);
      } else {
        //
      }
    });
}

// 对axios的实例重新封装成一个plugin ,方便 Vue.use(xxxx)
export default axiosBase;
