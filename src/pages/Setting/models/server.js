import axiosBase from '@utils/http';
//获取基本信息选中的子段
export function getSelectField(params) {
  return axiosBase('/apiweb/approve/selectBasicInfoField', 'get', params);
}
//添加基本信息字段
export function create(params) {
  return axiosBase('/apiweb/approve/addBasicInfoField', 'post', params);
}
export const pathData = [
  {
    authId: '',
    title: '权限设置',
    children: [
      {
        title: '角色管理',
        img: '',
        path: '',
      },
      {
        title: '人员管理',
        img: '',
        path: '',
      },
    ],
  },
  {
    authId: '',
    title: '招聘平台对接',
    children: [
      {
        title: '招聘平台对接',
        img: '',
        path: '',
      },
      {
        title: '招聘渠道',
        img: '',
        path: '',
      },
    ],
  },
  {
    authId: '',
    title: '模板设置',
    children: [
      {
        title: '淘汰模板',
        img: '',
        path: '',
      },
      {
        title: 'Offer模板',
        img: '',
        path: '',
      },
      {
        title: '面试通知模板',
        img: '',
        path: '',
      },
      {
        title: '应聘登记表',
        img: '',
        path: '',
      },
      {
        title: '面试签到码',
        img: '',
        path: '',
      },
      {
        title: '人才库分类管理',
        img: '',
        path: '',
      },
      {
        title: '标准简历模板',
        img: '',
        path: '',
      },
    ],
  },
  {
    authId: '',
    title: '审批管理',
    children: [
      {
        title: '审批流程设置',
        img: '',
        path: '',
      },
      {
        title: '审批',
        img: '',
        path: '',
      },
    ],
  },
  {
    authId: '',
    title: '标签管理',
    children: [
      {
        title: '标签',
        img: '',
        path: '',
      },
      {
        title: '放弃入职原因',
        img: '',
        path: '',
      },
      {
        title: '淘汰原因',
        img: '',
        path: '',
      },
      {
        title: '地址管理（招聘专员）',
        img: '',
        path: '',
      },
      {
        title: '招聘部门',
        img: '',
        path: '',
      },
    ],
  },
];
