// export default  'https://devbdapi.sogukj.com/'
console.log(process.env.REACT_APP_ENV);
const env = {
  development: {
    //apiurl_web: 'http://192.168.28.93:8888/',
    // apiurl_web: 'https://da.hire66.com', //线上 https://devbdh5.sogukj.com
    // apiurl_web: 'http://192.168.31.20:8080', //金绍彬本地
    apiurl_two: 'https://dw.hire66.com', // 前端 支付后的回调地址baseUrl
    apiurl_three: 'https://dh.hire66.com/#/', // 发送叮消息

    api_pdf: 'https://h.hire66.com', //预览pdf链接
    api_pdf_windows: 'https://bc.hire66.com/onlinePreview', //预览pdf链接
    apiurl_website: 'https://dwww.hire66.com/', //  配置官网链接
    REACT_APP_ENV: 'development',
    // apiurl_web: 'http://cpolar.featherlet.cn',
     //apiurl_web: 'http://211.149.238.180:8080/rnlims',
    //apiurl_web: 'http://cpolar.featherlet.cn/',
    apiurl_web: 'http://araml.natapp1.cc/',
  },

  production: {
    apiurl_web: 'https://a.hire66.com', //线上 https://devbdh5.sogukj.com
    apiurl_two: 'https://w.hire66.com', // 前端 支付后的回调地址baseUrlgit
    apiurl_three: 'https://h.hire66.com/#/', // 发送叮消息

    apiurl_website: 'https://hire66.com/', //  配置官网链接

    api_pdf: 'https://h.hire66.com', //预览pdf链接
    api_pdf_windows: 'https://bc.hire66.com/onlinePreview', //预览pdf链接
    REACT_APP_ENV: 'production',
  },
};
export default env[process.env.REACT_APP_ENV];
