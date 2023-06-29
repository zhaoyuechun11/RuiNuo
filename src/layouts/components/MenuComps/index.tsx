import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { flatToTree2 } from '@/utils';
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
import { Link, history, useSelector } from 'umi';
interface IMenu {
  title: string;
  children: Array<IMenu>;
  path: string;
  icon?: string;
  key: string;
}

const menu = [
  {
    title: '首页',
    icon: null,
    key: '1',
    path: '/home',
    children: [],
  },
  {
    title: '委外样本管理',
    icon: null,
    path: '/home',
    key: '2',
    children: [
      {
        title: '外送样本移交',
        icon: null,
        path: '/home',
        children: [],
        key: '21',
      },
      {
        title: '外送样本对账明细',
        icon: null,
        path: '/home',
        key: '3',
        children: [
          {
            title: 'Option 3',
            icon: null,
            path: '/home',
            key: '31',
            children: [],
          },
        ],
      },
      {
        title: '外送样本对账统计',
        icon: null,
        path: '/home',
        key: '3',
        children: [
          {
            title: 'Option 3',
            icon: null,
            path: '/home',
            key: '31',
            children: [],
          },
        ],
      },
      {
        title: '外送样本对账管理',
        icon: null,
        path: '/home',
        key: '3',
        children: [
          {
            title: 'Option 3',
            icon: null,
            path: '/home',
            key: '31',
            children: [],
          },
        ],
      },
    ],
  },
  {
    title: '常规检查',
    icon: null,
    path: '/home',
    key: '2',
    children: [
      {
        title: '上机任务分配-多仪器',
        icon: null,
        path: '/home',
        children: [],
        key: '21',
      },
      {
        title: '常规检验',
        icon: null,
        path: '/home',
        key: '3',
        children: [
          {
            title: 'Option 3',
            icon: null,
            path: '/home',
            key: '31',
            children: [],
          },
        ],
      },
      {
        title: '上机任务分配',
        icon: null,
        path: '/home',
        key: '3',
        children: [
          {
            title: 'Option 3',
            icon: null,
            path: '/home',
            key: '31',
            children: [],
          },
        ],
      },
    ],
  },
  {
    key: 'setting',
    path: '/setting/index',
    title: '批量录入',
    icon: 'iconT8-shezhi-weixuanzhong',
    selIcon: 'iconT8-shezhi-xuanzhong',
    children: [],
  },
  {
    key: 'setting',
    path: '/setting/index',
    title: '批量调整结果',
    icon: 'iconT8-shezhi-weixuanzhong',
    selIcon: 'iconT8-shezhi-xuanzhong',
    children: [],
  },
  {
    key: 'setting',
    path: '/setting/index',
    title: '结果合并',
    icon: 'iconT8-shezhi-weixuanzhong',
    selIcon: 'iconT8-shezhi-xuanzhong',
    children: [],
  },
  {
    key: 'setting',
    path: '/setting/index',
    title: '检验项目选择',
    icon: 'iconT8-shezhi-weixuanzhong',
    selIcon: 'iconT8-shezhi-xuanzhong',
    children: [],
  },
  {
    key: 'setting',
    path: '/setting/index',
    title: '详情',
    icon: 'iconT8-shezhi-weixuanzhong',
    selIcon: 'iconT8-shezhi-xuanzhong',
    children: [],
  },
  {
    key: 'setting',
    path: '/setting/index',
    title: '危急值',
    icon: 'iconT8-shezhi-weixuanzhong',
    selIcon: 'iconT8-shezhi-xuanzhong',
    children: [],
  },
  {
    key: 'setting',
    path: '/setting/index',
    title: '样本登记',
    icon: 'iconT8-shezhi-weixuanzhong',
    selIcon: 'iconT8-shezhi-xuanzhong',
    children: [
      {
        key: 'setting',
        path: '/setting/index',
        title: '样本登记列表',
        icon: 'iconT8-shezhi-weixuanzhong',
        selIcon: 'iconT8-shezhi-xuanzhong',
        children: [],
      },
      {
        key: 'setting',
        path: '/setting/index',
        title: '样本新增页面',
        icon: 'iconT8-shezhi-weixuanzhong',
        selIcon: 'iconT8-shezhi-xuanzhong',
        children: [],
      },
      {
        key: 'setting',
        path: '/setting/index',
        title: '样本编辑页面',
        icon: 'iconT8-shezhi-weixuanzhong',
        selIcon: 'iconT8-shezhi-xuanzhong',
        children: [],
      },
      {
        key: 'setting',
        path: '/setting/index',
        title: '扫码录入',
        icon: 'iconT8-shezhi-weixuanzhong',
        selIcon: 'iconT8-shezhi-xuanzhong',
        children: [],
      },
    ],
  },
  {
    key: 'setting',
    path: '/setting/index',
    title: '分拣',
    icon: 'iconT8-shezhi-weixuanzhong',
    selIcon: 'iconT8-shezhi-xuanzhong',
    children: [],
  },
  {
    key: 'setting',
    path: '/setting/index',
    title: '移交',
    icon: 'iconT8-shezhi-weixuanzhong',
    selIcon: 'iconT8-shezhi-xuanzhong',
    children: [],
  },
  {
    key: 'setting',
    path: '/setting/index',
    title: '客服模块',
    icon: 'iconT8-shezhi-weixuanzhong',
    selIcon: 'iconT8-shezhi-xuanzhong',
    children: [
      {
        key: 'setting',
        path: '/setting/index',
        title: '客服交接管理',
        icon: 'iconT8-shezhi-weixuanzhong',
        selIcon: 'iconT8-shezhi-xuanzhong',
        children: [],
      },
      {
        key: 'setting',
        path: '/setting/index',
        title: '客服统计',
        icon: 'iconT8-shezhi-weixuanzhong',
        selIcon: 'iconT8-shezhi-xuanzhong',
        children: [],
      },
    ],
  },
  {
    key: 'setting',
    path: '/setting/index',
    title: '咨询管理',
    icon: 'iconT8-shezhi-weixuanzhong',
    selIcon: 'iconT8-shezhi-xuanzhong',
    children: [
      {
        key: 'setting',
        path: '/setting/index',
        title: '咨询管理登记',
        icon: 'iconT8-shezhi-weixuanzhong',
        selIcon: 'iconT8-shezhi-xuanzhong',
        children: [],
      },
      {
        key: 'setting',
        path: '/setting/index',
        title: '咨询统计',
        icon: 'iconT8-shezhi-weixuanzhong',
        selIcon: 'iconT8-shezhi-xuanzhong',
        children: [],
      },
    ],
  },
  {
    key: 'setting',
    path: '/setting/index',
    title: '加减项管理',
    icon: 'iconT8-shezhi-weixuanzhong',
    selIcon: 'iconT8-shezhi-xuanzhong',
    children: [],
  },
  {
    key: 'setting',
    path: '/setting/index',
    title: '回退管理',
    icon: 'iconT8-shezhi-weixuanzhong',
    selIcon: 'iconT8-shezhi-xuanzhong',
    children: [],
  },
  {
    key: 'setting',
    path: '/setting/index',
    title: '延迟管理',
    icon: 'iconT8-shezhi-weixuanzhong',
    selIcon: 'iconT8-shezhi-xuanzhong',
    children: [],
  },
  {
    key: 'setting',
    path: '/setting/index',
    title: '签收',
    icon: 'iconT8-shezhi-weixuanzhong',
    selIcon: 'iconT8-shezhi-xuanzhong',
    children: [
      {
        key: 'setting',
        path: '/setting/index',
        title: '单个签收页面',
        icon: 'iconT8-shezhi-weixuanzhong',
        selIcon: 'iconT8-shezhi-xuanzhong',
        children: [],
      },
    ],
  },
  {
    key: 'setting',
    path: '/setting/index',
    title: '分血',
    icon: 'iconT8-shezhi-weixuanzhong',
    selIcon: 'iconT8-shezhi-xuanzhong',
    children: [],
  },
  {
    key: 'setting',
    path: '/setting/index',
    title: '报告审核',
    icon: 'iconT8-shezhi-weixuanzhong',
    selIcon: 'iconT8-shezhi-xuanzhong',
    children: [],
  },
  {
    key: 'setting',
    path: '/setting/index',
    title: '报告单综合查询',
    icon: 'iconT8-shezhi-weixuanzhong',
    selIcon: 'iconT8-shezhi-xuanzhong',
    children: [],
  },
  {
    key: 'setting',
    path: '/setting/index',
    title: '历史报告回顾',
    icon: 'iconT8-shezhi-weixuanzhong',
    selIcon: 'iconT8-shezhi-xuanzhong',
    children: [],
  },
  {
    key: 'setting',
    path: '/setting/index',
    title: '延时报告查询',
    icon: 'iconT8-shezhi-weixuanzhong',
    selIcon: 'iconT8-shezhi-xuanzhong',
    children: [],
  },
  {
    key: 'commonMaterials',
    path: '/commonMaterials/index',
    title: '常用资料设置',
    icon: 'iconT8-shezhi-weixuanzhong',
    selIcon: 'iconT8-shezhi-xuanzhong',
    children: [
      {
        key: 'inspectionInstruments',
        path: '/commonMaterials/inspectionInstruments',
        title: '检验仪器维护',
        icon: 'iconT8-shezhi-weixuanzhong',
        selIcon: 'iconT8-shezhi-xuanzhong',
        btn: [
          {
            key: 'add',
            path: '',
            title: '新增',
            icon: 'iconT8-shezhi-weixuanzhong',
            selIcon: 'iconT8-shezhi-xuanzhong',
            children: [],
          },
          {
            key: 'edit',
            path: '',
            title: '编辑',
            icon: 'iconT8-shezhi-weixuanzhong',
            selIcon: 'iconT8-shezhi-xuanzhong',
            children: [],
          },
          {
            key: 'delete',
            path: '',
            title: '删除',
            icon: 'iconT8-shezhi-weixuanzhong',
            selIcon: 'iconT8-shezhi-xuanzhong',
            children: [],
          },
          {
            key: 'import',
            path: '',
            title: '导入',
            icon: 'iconT8-shezhi-weixuanzhong',
            selIcon: 'iconT8-shezhi-xuanzhong',
            children: [],
          },
          {
            key: 'export',
            path: '',
            title: '导出',
            icon: 'iconT8-shezhi-weixuanzhong',
            selIcon: 'iconT8-shezhi-xuanzhong',
            children: [],
          },
          {
            key: 'bind',
            path: '',
            title: '绑定',
            icon: 'iconT8-shezhi-weixuanzhong',
            selIcon: 'iconT8-shezhi-xuanzhong',
            children: [],
          },
          {
            key: 'detail',
            path: '',
            title: '明细',
            icon: 'iconT8-shezhi-weixuanzhong',
            selIcon: 'iconT8-shezhi-xuanzhong',
            children: [
              {
                btn: [
                  {
                    key: 'add',
                    path: '',
                    title: '新增',
                    icon: 'iconT8-shezhi-weixuanzhong',
                    selIcon: 'iconT8-shezhi-xuanzhong',
                    children: [],
                  },
                  {
                    key: 'edit',
                    path: '',
                    title: '编辑',
                    icon: 'iconT8-shezhi-weixuanzhong',
                    selIcon: 'iconT8-shezhi-xuanzhong',
                    children: [],
                  },
                  {
                    key: 'delete',
                    path: '',
                    title: '删除',
                    icon: 'iconT8-shezhi-weixuanzhong',
                    selIcon: 'iconT8-shezhi-xuanzhong',
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },

      {
        key: 'basicData',
        path: '/commonMaterials/basicData',
        title: '常见资料维护',
        icon: 'iconT8-shezhi-weixuanzhong',
        selIcon: 'iconT8-shezhi-xuanzhong',
        children: [],
        btn: [
          {
            key: 'detail',
            path: '',
            title: '明细',
            icon: 'iconT8-shezhi-weixuanzhong',
            selIcon: 'iconT8-shezhi-xuanzhong',
            children: [
              {
                btn: [
                  {
                    key: 'add',
                    path: '',
                    title: '新增',
                    icon: 'iconT8-shezhi-weixuanzhong',
                    selIcon: 'iconT8-shezhi-xuanzhong',
                    children: [],
                  },
                  {
                    key: 'edit',
                    path: '',
                    title: '编辑',
                    icon: 'iconT8-shezhi-weixuanzhong',
                    selIcon: 'iconT8-shezhi-xuanzhong',
                    children: [],
                  },
                  {
                    key: 'delete',
                    path: '',
                    title: '删除',
                    icon: 'iconT8-shezhi-weixuanzhong',
                    selIcon: 'iconT8-shezhi-xuanzhong',
                    children: [],
                  },
                  {
                    key: 'import',
                    path: '',
                    title: '导入',
                    icon: 'iconT8-shezhi-weixuanzhong',
                    selIcon: 'iconT8-shezhi-xuanzhong',
                    children: [],
                  },
                  {
                    key: 'export',
                    path: '',
                    title: '导出',
                    icon: 'iconT8-shezhi-weixuanzhong',
                    selIcon: 'iconT8-shezhi-xuanzhong',
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },

      {
        key: 'inspectionUnit',
        path: '/commonMaterials/inspectionUnit',
        title: '送检单位维护',
        icon: 'iconT8-shezhi-weixuanzhong',
        selIcon: 'iconT8-shezhi-xuanzhong',
        children: [],
        btn: [
          {
            key: 'add',
            path: '',
            title: '新增',
            icon: 'iconT8-shezhi-weixuanzhong',
            selIcon: 'iconT8-shezhi-xuanzhong',
            children: [],
          },
          {
            key: 'edit',
            path: '',
            title: '编辑',
            icon: 'iconT8-shezhi-weixuanzhong',
            selIcon: 'iconT8-shezhi-xuanzhong',
            children: [],
          },
          {
            key: 'delete',
            path: '',
            title: '删除',
            icon: 'iconT8-shezhi-weixuanzhong',
            selIcon: 'iconT8-shezhi-xuanzhong',
            children: [],
          },
          {
            key: 'import',
            path: '',
            title: '导入',
            icon: 'iconT8-shezhi-weixuanzhong',
            selIcon: 'iconT8-shezhi-xuanzhong',
            children: [],
          },
          {
            key: 'export',
            path: '',
            title: '导出',
            icon: 'iconT8-shezhi-weixuanzhong',
            selIcon: 'iconT8-shezhi-xuanzhong',
            children: [],
          },
        ],
      },
      {
        key: 'majorGroup',
        path: '/commonMaterials/majorGroup',
        title: '专业分类维护',
        icon: 'iconT8-shezhi-weixuanzhong',
        selIcon: 'iconT8-shezhi-xuanzhong',
        children: [],
        btn: [
          {
            key: 'add',
            path: '',
            title: '新增',
            icon: 'iconT8-shezhi-weixuanzhong',
            selIcon: 'iconT8-shezhi-xuanzhong',
            children: [],
          },
          {
            key: 'edit',
            path: '',
            title: '编辑',
            icon: 'iconT8-shezhi-weixuanzhong',
            selIcon: 'iconT8-shezhi-xuanzhong',
            children: [],
          },
          {
            key: 'delete',
            path: '',
            title: '删除',
            icon: 'iconT8-shezhi-weixuanzhong',
            selIcon: 'iconT8-shezhi-xuanzhong',
            children: [],
          },
          {
            key: 'import',
            path: '',
            title: '导入',
            icon: 'iconT8-shezhi-weixuanzhong',
            selIcon: 'iconT8-shezhi-xuanzhong',
            children: [],
          },
          {
            key: 'export',
            path: '',
            title: '导出',
            icon: 'iconT8-shezhi-weixuanzhong',
            selIcon: 'iconT8-shezhi-xuanzhong',
            children: [],
          },
          {
            key: 'bind',
            path: '',
            title: '绑定',
            icon: 'iconT8-shezhi-weixuanzhong',
            selIcon: 'iconT8-shezhi-xuanzhong',
            children: [],
          },
        ],
      },
      {
        key: 'taskGroup',
        path: '/commonMaterials/taskGroup',
        title: '任务分类维护',
        icon: 'iconT8-shezhi-weixuanzhong',
        selIcon: 'iconT8-shezhi-xuanzhong',
        children: [],
        btn: [
          {
            key: 'bind',
            path: '',
            title: '绑定',
            icon: 'iconT8-shezhi-weixuanzhong',
            selIcon: 'iconT8-shezhi-xuanzhong',
            children: [],
          },
        ],
      },
      {
        key: 'manageGroup',
        path: '/commonMaterials/manageGroup',
        title: '管理分类维护',
        icon: 'iconT8-shezhi-weixuanzhong',
        selIcon: 'iconT8-shezhi-xuanzhong',
        children: [],
        btn: [
          {
            key: 'add',
            path: '',
            title: '新增',
            icon: 'iconT8-shezhi-weixuanzhong',
            selIcon: 'iconT8-shezhi-xuanzhong',
            children: [],
          },
          {
            key: 'edit',
            path: '',
            title: '编辑',
            icon: 'iconT8-shezhi-weixuanzhong',
            selIcon: 'iconT8-shezhi-xuanzhong',
            children: [],
          },
          {
            key: 'delete',
            path: '',
            title: '删除',
            icon: 'iconT8-shezhi-weixuanzhong',
            selIcon: 'iconT8-shezhi-xuanzhong',
            children: [],
          },
          {
            key: 'import',
            path: '',
            title: '导入',
            icon: 'iconT8-shezhi-weixuanzhong',
            selIcon: 'iconT8-shezhi-xuanzhong',
            children: [],
          },
          {
            key: 'export',
            path: '',
            title: '导出',
            icon: 'iconT8-shezhi-weixuanzhong',
            selIcon: 'iconT8-shezhi-xuanzhong',
            children: [],
          },
        ],
      },
      {
        key: 'applyProjectGroup',
        path: '/commonMaterials/applyProjectGroup',
        title: '申请项目分类',
        icon: 'iconT8-shezhi-weixuanzhong',
        selIcon: 'iconT8-shezhi-xuanzhong',
        children: [],
        btn: [
          {
            key: 'add',
            path: '',
            title: '新增',
            icon: 'iconT8-shezhi-weixuanzhong',
            selIcon: 'iconT8-shezhi-xuanzhong',
            children: [],
          },
          {
            key: 'edit',
            path: '',
            title: '编辑',
            icon: 'iconT8-shezhi-weixuanzhong',
            selIcon: 'iconT8-shezhi-xuanzhong',
            children: [],
          },
          {
            key: 'delete',
            path: '',
            title: '删除',
            icon: 'iconT8-shezhi-weixuanzhong',
            selIcon: 'iconT8-shezhi-xuanzhong',
            children: [],
          },
          {
            key: 'import',
            path: '',
            title: '导入',
            icon: 'iconT8-shezhi-weixuanzhong',
            selIcon: 'iconT8-shezhi-xuanzhong',
            children: [],
          },
          {
            key: 'export',
            path: '',
            title: '导出',
            icon: 'iconT8-shezhi-weixuanzhong',
            selIcon: 'iconT8-shezhi-xuanzhong',
            children: [],
          },
          {
            key: 'detail',
            path: '',
            title: '明细',
            icon: 'iconT8-shezhi-weixuanzhong',
            selIcon: 'iconT8-shezhi-xuanzhong',
            children: [
              {
                key: 'usingHospitals',
                path: '',
                title: '使用医院',
                icon: 'iconT8-shezhi-weixuanzhong',
                selIcon: 'iconT8-shezhi-xuanzhong',
                btn: [
                  {
                    key: 'add',
                    path: '',
                    title: '新增',
                    icon: 'iconT8-shezhi-weixuanzhong',
                    selIcon: 'iconT8-shezhi-xuanzhong',
                    children: [],
                  },
                  {
                    key: 'delete',
                    path: '',
                    title: '删除',
                    icon: 'iconT8-shezhi-weixuanzhong',
                    selIcon: 'iconT8-shezhi-xuanzhong',
                    children: [],
                  },
                ],
              },
              {
                key: 'combinationDetails',
                path: '',
                title: '组合明细',
                icon: 'iconT8-shezhi-weixuanzhong',
                selIcon: 'iconT8-shezhi-xuanzhong',
                btn: [
                  {
                    key: 'add',
                    path: '',
                    title: '新增',
                    icon: 'iconT8-shezhi-weixuanzhong',
                    selIcon: 'iconT8-shezhi-xuanzhong',
                    children: [],
                  },
                  {
                    key: 'delete',
                    path: '',
                    title: '删除',
                    icon: 'iconT8-shezhi-weixuanzhong',
                    selIcon: 'iconT8-shezhi-xuanzhong',
                    children: [],
                  },
                ],
              },
              {
                key: 'instrument',
                path: '',
                title: '仪器',
                icon: 'iconT8-shezhi-weixuanzhong',
                selIcon: 'iconT8-shezhi-xuanzhong',
                btn: [
                  {
                    key: 'add',
                    path: '',
                    title: '新增',
                    icon: 'iconT8-shezhi-weixuanzhong',
                    selIcon: 'iconT8-shezhi-xuanzhong',
                    children: [],
                  },
                  {
                    key: 'delete',
                    path: '',
                    title: '删除',
                    icon: 'iconT8-shezhi-weixuanzhong',
                    selIcon: 'iconT8-shezhi-xuanzhong',
                    children: [],
                  },
                ],
              },
              {
                key: 'report',
                path: '',
                title: '报告项目',
                icon: 'iconT8-shezhi-weixuanzhong',
                selIcon: 'iconT8-shezhi-xuanzhong',
                btn: [
                  {
                    key: 'add',
                    path: '',
                    title: '新增',
                    icon: 'iconT8-shezhi-weixuanzhong',
                    selIcon: 'iconT8-shezhi-xuanzhong',
                    children: [],
                  },
                  {
                    key: 'delete',
                    path: '',
                    title: '删除',
                    icon: 'iconT8-shezhi-weixuanzhong',
                    selIcon: 'iconT8-shezhi-xuanzhong',
                    children: [],
                  },
                ],
              },
              {
                key: 'guidePrice',
                path: '',
                title: '基准价格',
                icon: 'iconT8-shezhi-weixuanzhong',
                selIcon: 'iconT8-shezhi-xuanzhong',
                btn: [
                  {
                    key: 'add',
                    path: '',
                    title: '新增',
                    icon: 'iconT8-shezhi-weixuanzhong',
                    selIcon: 'iconT8-shezhi-xuanzhong',
                    children: [],
                  },
                  {
                    key: 'delete',
                    path: '',
                    title: '删除',
                    icon: 'iconT8-shezhi-weixuanzhong',
                    selIcon: 'iconT8-shezhi-xuanzhong',
                    children: [],
                  },
                  {
                    key: 'edit',
                    path: '',
                    title: '编辑',
                    icon: 'iconT8-shezhi-weixuanzhong',
                    selIcon: 'iconT8-shezhi-xuanzhong',
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        key: 'applyReportPC',
        path: '/commonMaterials/applyReportPC',
        title: '申请项目和报告项目对照',
        icon: 'iconT8-shezhi-weixuanzhong',
        selIcon: 'iconT8-shezhi-xuanzhong',
        children: [],
        btn: [
          {
            key: 'add',
            path: '',
            title: '新增',
            icon: 'iconT8-shezhi-weixuanzhong',
            selIcon: 'iconT8-shezhi-xuanzhong',
            children: [],
          },
          {
            key: 'edit',
            path: '',
            title: '编辑',
            icon: 'iconT8-shezhi-weixuanzhong',
            selIcon: 'iconT8-shezhi-xuanzhong',
            children: [],
          },
          {
            key: 'delete',
            path: '',
            title: '删除',
            icon: 'iconT8-shezhi-weixuanzhong',
            selIcon: 'iconT8-shezhi-xuanzhong',
            children: [],
          },
          {
            key: 'import',
            path: '',
            title: '导入',
            icon: 'iconT8-shezhi-weixuanzhong',
            selIcon: 'iconT8-shezhi-xuanzhong',
            children: [],
          },
          {
            key: 'export',
            path: '',
            title: '导出',
            icon: 'iconT8-shezhi-weixuanzhong',
            selIcon: 'iconT8-shezhi-xuanzhong',
            children: [],
          },
          {
            key: 'detail',
            path: '',
            title: '明细',
            icon: 'iconT8-shezhi-weixuanzhong',
            selIcon: 'iconT8-shezhi-xuanzhong',
            children: [
              {
                key: 'instrumentNumber',
                path: '',
                title: '仪器号',
                icon: 'iconT8-shezhi-weixuanzhong',
                selIcon: 'iconT8-shezhi-xuanzhong',
                btn: [
                  {
                    key: 'add',
                    path: '',
                    title: '新增',
                    icon: 'iconT8-shezhi-weixuanzhong',
                    selIcon: 'iconT8-shezhi-xuanzhong',
                    children: [],
                  },
                  {
                    key: 'delete',
                    path: '',
                    title: '删除',
                    icon: 'iconT8-shezhi-weixuanzhong',
                    selIcon: 'iconT8-shezhi-xuanzhong',
                    children: [],
                  },
                  {
                    key: 'edit',
                    path: '',
                    title: '编辑',
                    icon: 'iconT8-shezhi-weixuanzhong',
                    selIcon: 'iconT8-shezhi-xuanzhong',
                    children: [],
                  },
                ],
              },
              {
                key: 'referenceValue',
                path: '',
                title: '参考值',
                icon: 'iconT8-shezhi-weixuanzhong',
                selIcon: 'iconT8-shezhi-xuanzhong',
                btn: [
                  {
                    key: 'add',
                    path: '',
                    title: '新增',
                    icon: 'iconT8-shezhi-weixuanzhong',
                    selIcon: 'iconT8-shezhi-xuanzhong',
                    children: [],
                  },
                  {
                    key: 'delete',
                    path: '',
                    title: '删除',
                    icon: 'iconT8-shezhi-weixuanzhong',
                    selIcon: 'iconT8-shezhi-xuanzhong',
                    children: [],
                  },
                  {
                    key: 'edit',
                    path: '',
                    title: '编辑',
                    icon: 'iconT8-shezhi-weixuanzhong',
                    selIcon: 'iconT8-shezhi-xuanzhong',
                    children: [],
                  },
                ],
              },
              {
                key: 'criticalValue',
                path: '',
                title: '危机值',
                icon: 'iconT8-shezhi-weixuanzhong',
                selIcon: 'iconT8-shezhi-xuanzhong',
                btn: [
                  {
                    key: 'add',
                    path: '',
                    title: '新增',
                    icon: 'iconT8-shezhi-weixuanzhong',
                    selIcon: 'iconT8-shezhi-xuanzhong',
                    children: [],
                  },
                  {
                    key: 'delete',
                    path: '',
                    title: '删除',
                    icon: 'iconT8-shezhi-weixuanzhong',
                    selIcon: 'iconT8-shezhi-xuanzhong',
                    children: [],
                  },
                  {
                    key: 'edit',
                    path: '',
                    title: '编辑',
                    icon: 'iconT8-shezhi-weixuanzhong',
                    selIcon: 'iconT8-shezhi-xuanzhong',
                    children: [],
                  },
                ],
              },
              {
                key: 'formula',
                path: '',
                title: '计算公司',
                icon: 'iconT8-shezhi-weixuanzhong',
                selIcon: 'iconT8-shezhi-xuanzhong',
                btn: [
                  {
                    key: 'add',
                    path: '',
                    title: '新增',
                    icon: 'iconT8-shezhi-weixuanzhong',
                    selIcon: 'iconT8-shezhi-xuanzhong',
                    children: [],
                  },
                  {
                    key: 'delete',
                    path: '',
                    title: '删除',
                    icon: 'iconT8-shezhi-weixuanzhong',
                    selIcon: 'iconT8-shezhi-xuanzhong',
                    children: [],
                  },
                  {
                    key: 'edit',
                    path: '',
                    title: '编辑',
                    icon: 'iconT8-shezhi-weixuanzhong',
                    selIcon: 'iconT8-shezhi-xuanzhong',
                    children: [],
                  },
                ],
              },
              {
                key: 'commonResults ',
                path: '',
                title: '常用结果',
                icon: 'iconT8-shezhi-weixuanzhong',
                selIcon: 'iconT8-shezhi-xuanzhong',
                btn: [
                  {
                    key: 'add',
                    path: '',
                    title: '新增',
                    icon: 'iconT8-shezhi-weixuanzhong',
                    selIcon: 'iconT8-shezhi-xuanzhong',
                    children: [],
                  },
                  {
                    key: 'delete',
                    path: '',
                    title: '删除',
                    icon: 'iconT8-shezhi-weixuanzhong',
                    selIcon: 'iconT8-shezhi-xuanzhong',
                    children: [],
                  },
                  {
                    key: 'edit',
                    path: '',
                    title: '编辑',
                    icon: 'iconT8-shezhi-weixuanzhong',
                    selIcon: 'iconT8-shezhi-xuanzhong',
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        key: 'insUnitDiscount',
        path: '/commonMaterials/insUnitDiscount',
        title: '运检单位折扣维护',
        icon: 'iconT8-shezhi-weixuanzhong',
        selIcon: 'iconT8-shezhi-xuanzhong',
        children: [],
        btn: [
          {
            key: 'add',
            path: '',
            title: '新增',
            icon: 'iconT8-shezhi-weixuanzhong',
            selIcon: 'iconT8-shezhi-xuanzhong',
            children: [],
          },
          {
            key: 'edit',
            path: '',
            title: '编辑',
            icon: 'iconT8-shezhi-weixuanzhong',
            selIcon: 'iconT8-shezhi-xuanzhong',
            children: [],
          },
          {
            key: 'delete',
            path: '',
            title: '删除',
            icon: 'iconT8-shezhi-weixuanzhong',
            selIcon: 'iconT8-shezhi-xuanzhong',
            children: [],
          },
          {
            key: 'import',
            path: '',
            title: '导入',
            icon: 'iconT8-shezhi-weixuanzhong',
            selIcon: 'iconT8-shezhi-xuanzhong',
            children: [],
          },
          {
            key: 'export',
            path: '',
            title: '导出',
            icon: 'iconT8-shezhi-weixuanzhong',
            selIcon: 'iconT8-shezhi-xuanzhong',
            children: [],
          },
        ],
      },
    ],
  },
  {
    key: 'setting',
    path: '/setting/index',
    title: '设置',
    icon: 'iconT8-shezhi-weixuanzhong',
    selIcon: 'iconT8-shezhi-xuanzhong',
    children: [],
  },
];
const MenuComps: React.FC = (props) => {
  const { renderSuccess } = props;
  const { useDetail } = useSelector((state: any) => state.global);
  const [menuData, setMenuData] = useState<Array<IMenu>>();
  const handleClick = (e: any) => {};
  useEffect(() => {
    renderSuccess(false);
    //setMenuData(useDetail.permissions);
    setMenuData(transformTree(useDetail.permissions));
  }, [useDetail]);

  const transformTree = (list) => {
    const tree = [];

    for (let i = 0, len = list?.length; i < len; i++) {
      if (!list[i].parentId) {
        const item = queryChildren(list[i], list);

        tree.push(item);
      }
    }

    return tree;
  };

  const queryChildren = (parent, list) => {
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

  // const flatToTree = (data) => {
  //   const result = [];
  //   const itemMap = {};
  //   for (const item of data) {
  //     const id = item.id;
  //     const pId = item.parentId;

  //     if (itemMap[id]) {
  //       itemMap[id] = {
  //         ...itemMap[id],
  //         ...item,
  //       };
  //     } else {
  //       itemMap[id] = { ...item };
  //     }

  //     const treeItem = itemMap[id];

  //     if (!pId || pId === '0') {
  //       result.push(treeItem);
  //     } else {
  //       if (!itemMap[pId]) {
  //         itemMap[pId] = {
  //           children: [],
  //         };
  //       }
  //       if (!itemMap[pId].children) {
  //         itemMap[pId].children = [];
  //       }
  //       itemMap[pId].children.push(treeItem);
  //     }
  //   }
  //   return result;
  // };

  // 渲染不含children的目录
  const renderNoChildMenu = (item: IMenu) => {
    return (
      <Menu.Item key={item.title}>
        {' '}
        <Link key={item.key} to={item.url}>
          {item.name}
        </Link>
      </Menu.Item>
    );
  };
  // 渲染含有children的目录
  const renderChildMenu = (item: IMenu) => {
    return (
      <SubMenu key={item.name} title={item.name}>
        {item.children.map((child) => {
          return renderMenu(child);
        })}
      </SubMenu>
    );
  };
  // 渲染菜单
  const renderMenu = (item: IMenu) => {
    return item.children?.length ? renderChildMenu(item) : renderNoChildMenu(item);
  };
  return (
    <Sider collapsible trigger={null}>
      <Menu
        onClick={handleClick}
        style={{ width: '100%', marginTop: '2px' }}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={[]}
        mode="inline"
        theme="dark"
      >
        {menuData?.map((item: any) => renderMenu(item))}
      </Menu>
    </Sider>
  );
};

export default MenuComps;
