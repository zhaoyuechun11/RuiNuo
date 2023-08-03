
import moment from 'moment';
import URL from './env';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import pinyin from 'pinyin';
let permissionsResult = {};
// 日期选择 按照 周为单位
function formatDate(date) {
  var year = date.getFullYear() + '年';
  var month = date.getMonth() + 1 + '月';
  var day = date.getDate() + '日';
  var week = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][date.getDay()];

  return {
    month: month + day,
    day: day,
    week: week,
    timer: year + month + day,
    schedule: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
  };
}
function addDate(date, n) {
  date.setDate(date.getDate() + n);
  return date;
}
var currentFirstDate;
const weekDay = function (cb, type) {
  var clen = 7;
  function setDate(date) {
    var result = [];
    var week = date.getDay() - 1;
    date = addDate(date, week * -1);
    currentFirstDate = new Date(date);
    for (var i = 0; i < clen; i++) {
      result.push(formatDate(i == 0 ? addDate(date, 0) : addDate(date, 1)));
    }
    cb(result);
  }
  if (type) {
    setDate(addDate(currentFirstDate, type));
  } else {
    setDate(new Date());
  }
};

// 时间戳转化为年月日时分秒
const stampToTime = (timestamp) => {
  var d = new Date(timestamp.length < 13 ? timestamp * 1000 : timestamp); //根据时间戳生成的时间对象
  var time =
    d.getFullYear() +
    '-' +
    checkAddZone(d.getMonth() + 1) +
    '-' +
    checkAddZone(d.getDate()) +
    ' ' +
    checkAddZone(d.getHours()) +
    ':' +
    checkAddZone(d.getMinutes()) +
    ':' +
    checkAddZone(d.getSeconds());
  return time;
};
// 时间戳转化为年月日
const stampToDate = (timestamp) => {
  var d = new Date(timestamp.length < 13 ? timestamp * 1000 : timestamp);
  var date =
    d.getFullYear() + '-' + checkAddZone(d.getMonth() + 1) + '-' + checkAddZone(d.getDate());
  return date;
};
const checkAddZone = (num) => {
  return num < 10 ? '0' + num.toString() : num;
};
// 禁止选择历史时间
export const disabledDate = (current) => {
  return current && current < moment().startOf('day');
};
function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}
export const disabledDateTime = (current) => {
  let currentHours = moment().hours();
  let currentMinutes = moment().minutes();
  if (current < moment()) {
    return {
      disabledHours: () => range(0, 24).splice(0, currentHours),
      disabledMinutes: () => range(0, currentMinutes),
      disabledSeconds: () => [55, 56],
    };
  } else {
    return {
      disabledHours: () => range(0, 24).splice(0, 0),
      disabledMinutes: () => range(0, 60).splice(0, 0),
      disabledSeconds: () => [55, 56],
    };
  }
};
//   手机号隐藏显示
const hide = (str, type) => {
  let result;
  if (!str) {
    result = str;
    return result;
  }
  str = str.toString();
  if (type == 'phone') {
    result = str.substr(0, 3) + ' **** ' + str.substr(7);
  } else if (type == 'idCard') {
    //身份证隐藏
    result = str.substr(0, 5) + '***********' + str.substr(16);
  } else if (type == 'year') {
    str = moment(str).format('YYYY-MM-DD');
    result = '*****' + str.substr(5);
  } else {
    // 邮箱隐藏
    result = str.substr(0, str.indexOf('@') - 2) + '**' + str.substr(str.indexOf('@'));
  }

  return result;
};
const telFormat = (str) => {
  let result;
  if (!str) {
    result = str;
    return result;
  }
  str = str.toString();

  return str.substr(0, 3) + ` ${str.substr(3, 4)} ` + str.substr(7);
};
function clearNoNum(value) {
  value = value.replace(/[^\d.]/g, ''); //清除除了“数字”和“.”以外的字符
  value = value.replace(/\.{2,}/g, '.'); //只保留第一个. 清除多余的
  value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
  value = value.replace(/^(\-)*(\d+)\.(\d\d\d).*$/, '$1$2.$3'); //只能输入3个小数
  if (value.indexOf('.') < 0 && value != '') {
    //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
    value = parseFloat(value);
  }
  return value;
}

// 时间格式的问题
function defaultTimerHours(mon) {
  let years = mon.years();
  let month = mon.month();
  let date = mon.date();
  let hours = mon.minute() > 30 ? mon.add(1, 'hours').hours() : mon.hours();
  let minutes = mon.minute() < 30 || mon.minute() == 30 ? 30 : '00';
}

function copyToClip(content, callback) {
  var aux = document.createElement('input');
  aux.setAttribute('value', content);
  document.body.appendChild(aux);
  aux.select();
  document.execCommand('copy');
  document.body.removeChild(aux);
  if (callback) {
    callback();
  }
}
export const urlEncode = (param, key, encode) => {
  if (param == null) return '';
  var paramStr = '';
  var t = typeof param;
  if (t == 'string' || t == 'number' || t == 'boolean') {
    paramStr += '&' + key + '=' + (encode == null || encode ? encodeURIComponent(param) : param);
  } else {
    for (var i in param) {
      var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
      paramStr += urlEncode(param[i], k, encode);
    }
  }
  return paramStr;
};

// 防抖
export const debounce = (f, wait = 100, firstRun = false) => {
  let timer = null;
  let flag = true;
  return function () {
    clearTimeout(timer);
    if (firstRun && flag) {
      f.apply(this, arguments);
      flag = false;
    }
    timer = setTimeout(() => {
      if (firstRun) {
        flag = true;
      } else {
        f.apply(this, arguments);
      }
    }, wait);
  };
};
export const getRequest = (url) => {
  url = url == null ? window.location.href : url;
  let search = url.substring(url.lastIndexOf('?') + 1);
  let obj = {};
  let reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, function (rs, $1, $2) {
    let name = decodeURIComponent($1);
    let val = decodeURIComponent($2);
    val = String(val);
    obj[name] = val;
  });
  return obj;
};

// 操作系统
export const platform = () => {
  return window.navigator.platform;
};

// 获取本地存储 新手引导的值
export const getItem = () => {
  let stepObj = localStorage.getItem('stepObj');
  return JSON.parse(stepObj);
};
// 保存本地存储 新手引导
export const setItem = (val) => {
  let oldStepVal = getItem();
  let newStepVal = {
    ...oldStepVal,
    [val]: 1,
  };
  localStorage.setItem('stepObj', JSON.stringify(newStepVal));
};
export const removeWordXml = (text) => {
  let html = text;
  html = html.replace(/<\/?SPANYES[^>]*>/gi, ''); //  Remove  all  SPAN  tags
  // html = html.replace(/<(\w[^>]*)  class=([^|>]*)([^>]*)/gi, "<$1$3");  //  Remove  Class  attributes
  // html = html.replace(/<(\w[^>]*)  style="([^"]*)"([^>]*)/gi, "<$1$3");  //  Remove  Style  attributes
  html = html.replace(/<(\w[^>]*)  lang=([^|>]*)([^>]*)/gi, '<$1$3'); //  Remove  Lang  attributes
  html = html.replace(/<\\?\?xml[^>]*>/gi, ''); //  Remove  XML  elements  and  declarations
  html = html.replace(/<\/?\w+:[^>]*>/gi, ''); //  Remove  Tags  with  XML  namespace  declarations:  <o:p></o:p>
  html = html.replace(/&nbsp;/, ''); //  Replace  the  &nbsp;
  html = html.replace(/\n(\n)*( )*(\n)*\n/gi, '\n');
  //  Transform  <P>  to  <DIV>
  // var  re  =  new  RegExp("(<P)([^>]*>.*?)(<//P>)","gi")  ;            //  Different  because  of  a  IE  5.0  error
  //        html = html.replace(re, "<div$2</div>");
  return html;
};
export default {
  weekDay,
  stampToTime,
  stampToDate,
  hide,
  telFormat,
  clearNoNum,
  defaultTimerHours,
  copyToClip,
  debounce,
  getRequest,
  platform,
  getItem,
  setItem,
};

// 获取URL 参数
export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}
// 上传图片的功能 editor是富文本实例
export function wangEditorUploadImage(editor) {
  editor.customConfig.uploadFileName = 'file'; //设置文件上传的参数名称
  editor.customConfig.uploadImgMaxSize = 10 * 1024 * 1024;
  // editor.customConfig.uploadImgMaxLength = 5;
  editor.customConfig.uploadImgServer = URL.apiurl_web + '/file/upload';
  editor.customConfig.uploadImgHeaders = {
    Authorization: `${localStorage.getItem('access_token')}`,
  };
  editor.customConfig.uploadImgHooks = {
    success: function (xhr, editor, result) {
      // 图片上传并返回结果，图片插入成功之后触发
      // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
    },
    fail: function (xhr, editor, result) {
      // 图片上传并返回结果，但图片插入错误时触发
      // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
    },
    error: function (xhr, editor) {
      // 图片上传出错时触发
      // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
    },
    customInsert: function (insertImg, result, editor) {
      var url = result.data.fileServerUrl;
      insertImg(url);
    },
  };
}

// 配置拼音规则
export const getConfigPinyin = (value) => {
  let data = pinyin(value, {
    style: pinyin.STYLE_NORMAL, // 设置拼音风格
  });
  let allValue = '';
  data &&
    data.forEach((item) => {
      allValue = allValue + item.join('');
    });
  return allValue;
};
export const downLoad = (href, fileName) => {
  const a = document.createElement('a');
  a.download = `${fileName}.xls`;
  a.style.display = 'none';
  a.href = href;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
export const main = (data, path) => {
  data?.forEach(function (item) {
    //if用来判断外层，else if用来判断里层，调用递归函数的有2个判断条件在“有goods属性并且不为空”情况下才调用
    if (item.url === path) {
      permissionsResult = item;
      console.log('item', item);
    } else if (item.children && item.children.length > 0) {
      permissionsResult = main(item.children, path); //递归
    }
  });
  return permissionsResult;
};

export const transformTree = (list) => {
  const tree = [];

  for (let i = 0, len = list?.length; i < len; i++) {
    if (!list[i].parentId) {
      const item = queryChildren(list[i], list);

      tree.push(item);
    }
  }

  return tree;
};

export const queryChildren = (parent, list) => {
  const children = [];
  const btn = [];
  for (let i = 0, len = list.length; i < len; i++) {
    if (list[i].parentId === parent.id && list[i].type !== 'button') {
      const item = queryChildren(list[i], list);

      children.push(item);
    }
    if (list[i].parentId === parent.id && list[i].type === 'button') {
      const item = queryChildren(list[i], list);

      btn.push(item);
    }
  }

  if (children.length) {
    parent.children = children;
  }
  if (btn.length) {
    parent.btn = btn;
  }

  return parent;
};

/**
 * 比较两个数组差异
 */
export function getArrDifference(arr1 = [], arr2 = []) {
  return arr1.concat(arr2).filter((v, i, arr) => {
    return arr.indexOf(v) === arr.lastIndexOf(v);
  });
}

/**
 * 根据id查找节点 输出节点
 * @param nodes 树
 * @param searchKey id
 */
export function searchTreeNodes(nodes, searchKey) {
  for (let _i = 0; _i < nodes.length; _i++) {
    if (nodes[_i].value == searchKey) {
      return nodes[_i];
    } else {
      if (nodes[_i].children && nodes[_i].children.length > 0) {
        let res = searchTreeNodes(nodes[_i].children, searchKey);
        if (res) {
          return res;
        }
      }
    }
  }
  return null;
}

/**
 * 获取该节点下子孙节点的id
 * @param data 节点
 * @param arr 返回数组
 */
export function searchTreeNodesAllId(data = [], arr = []) {
  Object.keys(data).forEach((key) => {
    arr.push(data[key].value);
    if (data[key].children && data[key].children.length)
      searchTreeNodesAllId(data[key].children, arr);
  });
  return arr;
}

/**
 * 通过当前节点id，获取树状结构所有的祖先节点id，包含当前节点id
 * @param {String|Number} code 当前节点id
 * @param {Array} tree 树状数组
 * @returns {Array} 所有祖先id，包含当前code
 */
export const getParentIdList = (code, tree) => {
  let arr = []; //要返回的数组
  for (let i = 0; i < tree.length; i++) {
    let item = tree[i];
    arr = [];
    arr.push(item.value); //保存当前节点id
    if (code == item.value) {
      //判断当前id是否是默认id
      return arr; //是则退出循环、返回数据
    } else {
      //否则进入下面判断，判断当前节点是否有子节点数据
      if (item.children && item.children.length > 0) {
        //合并子节点返回的数据
        arr = arr.concat(getParentIdList(code, item.children));
        if (arr.includes(code)) {
          //如果当前数据中已包含默认节点，则退出循环、返回数据
          return arr;
        }
      }
    }
  }
};

export const getCurrentTime = () => {
  const data = new Date();
  return (
    data.getFullYear() +
    '-' +
    data.getMonth() +
    '-' +
    data.getDay() +
    ' ' +
    data.getHours() +
    ':' +
    data.getMinutes() +
    ':' +
    data.getSeconds()
  );
};
export const duplicatesAndNum = (arr) => {
  let newArr = [...new Set(arr)];
  let lastArr = [];
  newArr.forEach((item) => {
    console.log(item);
    let num = 0;
    arr.forEach((i) => {
      if (item == i) {
        num++;
      }
    });
    lastArr.push({
      name: item,
      num,
    });
  });
  return lastArr;
};
export const createStr = (str, i) => {
  // rearSection 截取指定数值后面的字符冲
  let frontSection, rearSection, value;
  let backOf0;
  rearSection = str.substring(str.lastIndexOf(i.substr(i.length - 1, 1)), str.length); //截取以最后一个指定数值分割的后面部分
  //如果指定数值中包含0，并且数值的最后一位不为0
  if (i.indexOf('0') !== -1 && i.slice(i.length - 1) !== '0') {
    frontSection = str.substring(0, str.lastIndexOf('0')); // frontSection截取整个字符中以最后一位0前面的字符串
    backOf0 = i.substring(i.lastIndexOf('0')); // backOf0 截取指定字符以最后一个0 分割的后面的数值
    if (
      i.slice(-1) == '9' &&
      (Number(backOf0) + 1).toString().length > Number(backOf0).toString().length
    ) {
      //如果数值的最后一位是9，并且数值以最后一个0分割后加1后的长度比原来长度大（数值后为09,099,0999,0999，...)
      value = frontSection + (Number(backOf0) + 1) + rearSection.slice(1); //然后拼接
    } else {
      //如果数值加1后的长度没有变化拼接上前面的0（数值后为019,029,039，049，...)
      value = frontSection + '0' + (Number(backOf0) + 1) + rearSection.slice(1); //然后拼接
    }
  } else if (i.indexOf('0') !== -1 && i.slice(i.length - 1) == '0') {
    //如果指定数值中包含0，并且数值的最后一位为0
    frontSection = str.substring(0, str.lastIndexOf('0')); // frontSection截取整个字符中以最后一位0前面的字符串
    backOf0 = i.substring(i.lastIndexOf('0')); // backOf0 截取指定字符以最后一个0 分割的后面的数值
    value = frontSection + (Number(backOf0) + 1) + rearSection.slice(1); //拼接
  } else {
    //正常状态下
    frontSection = str.substring(0, str.lastIndexOf(i)); // frontSection截取整个字符中以指定数值前面的字符串
    value = frontSection + (Number(i) + 1) + rearSection.slice(1); //拼接
  }
  console.log('value :>> ', value);
  return value;
};
export const minusCreateStr = (str, i) => {
  // rearSection 截取指定数值后面的字符冲
  let frontSection, rearSection, value;
  let backOf0;
  rearSection = str.substring(str.lastIndexOf(i.substr(i.length - 1, 1)), str.length); //截取以最后一个指定数值分割的后面部分
  //如果指定数值中包含0，并且数值的最后一位不为0
  if (i.indexOf('0') !== -1 && i.slice(i.length - 1) !== '0') {
    frontSection = str.substring(0, str.lastIndexOf('0')); // frontSection截取整个字符中以最后一位0前面的字符串
    backOf0 = i.substring(i.lastIndexOf('0')); // backOf0 截取指定字符以最后一个0 分割的后面的数值
    if (
      i.slice(-1) == '9' &&
      (Number(backOf0) - 1).toString().length > Number(backOf0).toString().length
    ) {
      //如果数值的最后一位是9，并且数值以最后一个0分割后加1后的长度比原来长度大（数值后为09,099,0999,0999，...)
      value = frontSection + (Number(backOf0) - 1) + rearSection.slice(1); //然后拼接
    } else {
      //如果数值加1后的长度没有变化拼接上前面的0（数值后为019,029,039，049，...)
      value = frontSection + '0' + (Number(backOf0) - 1) + rearSection.slice(1); //然后拼接
    }
  } else if (i.indexOf('0') !== -1 && i.slice(i.length - 1) == '0') {
    //如果指定数值中包含0，并且数值的最后一位为0
    //frontSection = str.substring(0, str.lastIndexOf('0')); // frontSection截取整个字符中以最后一位0前面的字符串
    //backOf0 = i.substring(i.lastIndexOf('0')); // backOf0 截取指定字符以最后一个0 分割的后面的数值

    if (parseInt(i) !== 0) {
      //message.warning('不可再减了哦!');
      let strval = str.slice(0, -i.length);
      let middmalVal = i.slice(0, -parseInt(i).toString().length);
      value = strval + middmalVal + (parseInt(i) - 1);
    }

    //debugger;
    //value = frontSection + (Number(backOf0) - 1) + rearSection.slice(1); //拼接
  } else {
    //正常状态下
    frontSection = str.substring(0, str.lastIndexOf(i)); // frontSection截取整个字符中以指定数值前面的字符串
    value = frontSection + (Number(i) - 1) + rearSection.slice(1); //拼接
  }
  console.log('value :>> ', value);
  return value;
};
export const containsNumbers = (str) => {
  // 判断字符串中是否包含数字
  return /\d/.test(str);
};
