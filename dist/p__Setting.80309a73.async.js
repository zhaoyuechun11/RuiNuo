(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[18],{"0ofM":function(e,t,a){e.exports={settingContent:"settingContent___2Co0d",modalType:"modalType___3p02k"}},"27yw":function(e,t,a){e.exports={icon:"icon___3zdty",ico:"ico___3J9hr",title:"title___APqNi",modalLink:"modalLink___1jfx7",card:"card___2yoq9",borderBlue:"borderBlue___3M894",borderOrange:"borderOrange___28jKI",borderBluess:"borderBluess___1VHPM",borderNews:"borderNews___2Y2bO",customize:"customize___21BoF",borderTemplate:"borderTemplate___Gv2Nk",borderApproval:"borderApproval___3377z",borderTag:"borderTag___3ee6U",borderPurple:"borderPurple___39STL",borderYellow:"borderYellow___2dVnN",borderGreen:"borderGreen___2K-ow",wrap:"wrap___qcYho",newImg:"newImg___jkY_d"}},"7Qib":function(e,t,a){"use strict";a.d(t,"c",(function(){return O})),a.d(t,"b",(function(){return C}));var r=a("kZID"),o=a("L0Kt"),n=a.n(o);console.log("development","REACT_APP_ENV_envjs"),console.log("development","NODE_ENVjs");var l,i={development:{apiurl_one:"https://da.hire66.com",apiurl_two:"https://dw.hire66.com",apiurl_three:"https://dh.hire66.com/#/",api_pdf:"https://h.hire66.com",api_pdf_windows:"https://bc.hire66.com/onlinePreview",apiurl_website:"https://dwww.hire66.com/",apiurl_web:"http://cpolar.featherlet.cn"},production:{apiurl_web:"https://a.hire66.com",apiurl_one:"https://a.hire66.com",apiurl_two:"https://w.hire66.com",apiurl_three:"https://h.hire66.com/#/",apiurl_website:"https://hire66.com/",api_pdf:"https://h.hire66.com",api_pdf_windows:"https://bc.hire66.com/onlinePreview"}},c=i["development"];a("uv+w"),a("5Tzl");function s(e){var t=e.getFullYear()+"\u5e74",a=e.getMonth()+1+"\u6708",r=e.getDate()+"\u65e5",o=["\u661f\u671f\u5929","\u661f\u671f\u4e00","\u661f\u671f\u4e8c","\u661f\u671f\u4e09","\u661f\u671f\u56db","\u661f\u671f\u4e94","\u661f\u671f\u516d"][e.getDay()];return{month:a+r,day:r,week:o,timer:t+a+r,schedule:"".concat(e.getFullYear(),"-").concat(e.getMonth()+1,"-").concat(e.getDate())}}function d(e,t){return e.setDate(e.getDate()+t),e}n.a.locale("zh-cn");var u=function(e,t){var a=7;function r(t){var r=[],o=t.getDay()-1;t=d(t,-1*o),l=new Date(t);for(var n=0;n<a;n++)r.push(s(d(t,0==n?0:1)));e(r)}r(t?d(l,t):new Date)},m=e=>{var t=new Date(e.length<13?1e3*e:e),a=t.getFullYear()+"-"+b(t.getMonth()+1)+"-"+b(t.getDate())+" "+b(t.getHours())+":"+b(t.getMinutes())+":"+b(t.getSeconds());return a},p=e=>{var t=new Date(e.length<13?1e3*e:e),a=t.getFullYear()+"-"+b(t.getMonth()+1)+"-"+b(t.getDate());return a},b=e=>e<10?"0"+e.toString():e;var _=(e,t)=>{var a;return e?(e=e.toString(),"phone"==t?a=e.substr(0,3)+" **** "+e.substr(7):"idCard"==t?a=e.substr(0,5)+"***********"+e.substr(16):"year"==t?(e=n()(e).format("YYYY-MM-DD"),a="*****"+e.substr(5)):a=e.substr(0,e.indexOf("@")-2)+"**"+e.substr(e.indexOf("@")),a):(a=e,a)},g=e=>{var t;return e?(e=e.toString(),e.substr(0,3)+" ".concat(e.substr(3,4)," ")+e.substr(7)):(t=e,t)};function h(e){return e=e.replace(/[^\d.]/g,""),e=e.replace(/\.{2,}/g,"."),e=e.replace(".","$#$").replace(/\./g,"").replace("$#$","."),e=e.replace(/^(\-)*(\d+)\.(\d\d\d).*$/,"$1$2.$3"),e.indexOf(".")<0&&""!=e&&(e=parseFloat(e)),e}function v(e){e.years(),e.month(),e.date(),e.minute()>30?e.add(1,"hours").hours():e.hours(),e.minute()<30||e.minute()}function f(e,t){var a=document.createElement("input");a.setAttribute("value",e),document.body.appendChild(a),a.select(),document.execCommand("copy"),document.body.removeChild(a),t&&t()}var w=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:100,a=arguments.length>2&&void 0!==arguments[2]&&arguments[2],r=null,o=!0;return function(){clearTimeout(r),a&&o&&(e.apply(this,arguments),o=!1),r=setTimeout((()=>{a?o=!0:e.apply(this,arguments)}),t)}},y=e=>{e=null==e?window.location.href:e;var t=e.substring(e.lastIndexOf("?")+1),a={},r=/([^?&=]+)=([^?&=]*)/g;return t.replace(r,(function(e,t,r){var o=decodeURIComponent(t),n=decodeURIComponent(r);n=String(n),a[o]=n})),a},N=()=>window.navigator.platform,T=()=>{var e=localStorage.getItem("stepObj");return JSON.parse(e)},E=e=>{var t=T(),a=Object(r["a"])(Object(r["a"])({},t),{},{[e]:1});localStorage.setItem("stepObj",JSON.stringify(a))};t["a"]={weekDay:u,stampToTime:m,stampToDate:p,hide:_,telFormat:g,clearNoNum:h,defaultTimerHours:v,copyToClip:f,debounce:w,getRequest:y,platform:N,getItem:T,setItem:E};function O(e){e.customConfig.uploadFileName="file",e.customConfig.uploadImgMaxSize=10485760,e.customConfig.uploadImgServer=c.apiurl_web+"/file/upload",e.customConfig.uploadImgHeaders={Authorization:"".concat(localStorage.getItem("access_token"))},e.customConfig.uploadImgHooks={success:function(e,t,a){},fail:function(e,t,a){},error:function(e,t){},customInsert:function(e,t,a){var r=t.data.fileServerUrl;e(r)}}}var C=(e,t)=>{var a=document.createElement("a");a.download="".concat(t,".xls"),a.style.display="none",a.href=e,document.body.appendChild(a),a.click(),document.body.removeChild(a)}},SV4x:function(e,t,a){"use strict";a.r(t);a("qJ0f");var r=a("SST8"),o=a("q2e5"),n=a("0gua"),l=a("o1fQ"),i=a("xwgP"),c=a.n(i),s=a("aKEd"),d=a.n(s),u=e=>{var t=e.titleName;return c.a.createElement("div",{className:d.a.titleContent},c.a.createElement("div",{className:d.a.titleName},t),c.a.createElement("div",{className:d.a.line}))},m=a("9kvl"),p=a("27yw"),b=a.n(p),_=a("T/PB"),g=a.n(_),h=a("Kvkj"),v=e=>{var t=e.global,r=e.icon,o=e.title,n=e.path,l=e.classNames,s=e.setLoading,d=Object(i["useRef"])(),u=["\u5de5\u4f5c\u901a\u77e5","\u62db\u8058\u81ea\u52a8\u5316","\u5019\u9009\u4eba\u901a\u77e5","\u6284\u9001\u4eba\u7ba1\u7406"],p={borderBlue:b.a.borderBlue,borderOrange:b.a.borderOrange,borderBluess:b.a.borderBluess,borderNews:b.a.borderNews,borderTemplate:b.a.borderTemplate,borderApproval:b.a.borderApproval,borderTag:b.a.borderTag,borderPurple:b.a.borderPurple,borderYellow:b.a.borderYellow,borderCyan:b.a.borderCyan,borderGreen:b.a.borderGreen},_=e=>{if("\u5185\u63a8\u8bbe\u7f6e"==o||"\u730e\u5934\u8bbe\u7f6e"==o){var a={enterprise_id:t.enterprise_id,operator_id:t.operator_id};s(!0),g.a.post("/apiweb/recommend/checkEnterpriseInfo",a).then((e=>{s(!1),200==e.data.status_code?m["b"].push(n):d.current.show()}))}else m["b"].push(n)};return c.a.createElement("div",{onClick:_,className:b.a.modalLink},c.a.createElement("div",{className:"".concat(b.a.card," ").concat(p[l])},c.a.createElement("div",{className:"".concat(b.a.wrap," flex_start")},c.a.createElement("div",{className:b.a.icon},c.a.createElement(h["f"],{name:r,classStyle:b.a.ico})),c.a.createElement("p",{className:b.a.title},o,u.includes(o)&&c.a.createElement("img",{className:b.a.newImg,src:a("QvoP"),alt:"\u65b0\u589e\u529f\u80fd\u56fe\u6807"})))))},f=Object(m["a"])((e=>{var t=e.global;return{global:t}}))(v),w=a("0ofM"),y=a.n(w),N=a("7Qib"),T=a("ZO1O"),E=["global"],O=[{modalTitle:"\u6743\u9650\u8bbe\u7f6e",auth:!0,classname:"borderBlue",modalType:[{icon:"iconSZ-jiaoseguanli",title:"\u89d2\u8272\u7ba1\u7406",path:"/setting/organize"},{icon:"iconSZ-renyuanguanli",title:"\u4eba\u5458\u7ba1\u7406",path:"/setting/roleMange"},{icon:"iconSZ-renyuanguanli",title:"\u6743\u9650\u7ba1\u7406",path:"/setting/permissionMange"},{icon:"iconSZ-gongsixinxi",title:"\u516c\u53f8\u4fe1\u606f",path:"/setting/companyInfo"}]}],C=e=>{var t=e.global,a=Object(l["a"])(e,E),s=Object(i["useState"])(!1),d=Object(n["a"])(s,2),m=d[0],p=d[1];return Object(i["useEffect"])((()=>{var e=N["a"].getItem();a.dispatch({type:"global/setStepNum",payload:e||t.defaultObj})}),[]),c.a.createElement(T["a"],null,c.a.createElement(r["a"],{spinning:m},c.a.createElement("div",{className:y.a.settingContent},O.map((e=>c.a.createElement("div",{key:e.modalTitle},c.a.createElement(u,{titleName:e.modalTitle}),c.a.createElement("div",{className:y.a.modalType},e.modalType.map((a=>"\u6a21\u677f\u8bbe\u7f6e"!=e.modalTitle?c.a.createElement(f,Object(o["a"])({classNames:e.classname},a,{key:a.title,setLoading:p})):1*t.is_admin!==2||1*t.is_hr!==2||"\u4eba\u624d\u5e93\u5206\u7c7b\u7ba1\u7406"!=a.title?c.a.createElement(f,Object(o["a"])({classNames:e.classname},a,{key:a.title})):void 0)))))))))};t["default"]=Object(m["a"])((e=>{var t=e.global;return{global:t}}))(C)},aKEd:function(e,t,a){e.exports={titleContent:"titleContent___2AiC6",titleName:"titleName___CSvYl"}}}]);