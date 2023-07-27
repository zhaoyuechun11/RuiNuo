export default {
  routes: [
    {
      path: '/login',
      exact: true,
      component: '@/pages/Other/login',
      title: '登录',
    },
    {
      path: '/register',
      exact: true,
      component: '@/pages/Other/register',
      title: '选择角色',
    },
    {
      path: '/setNewPawd',
      exact: true,
      component: '@/pages/Other/setNewPawd',
      title: '选择角色',
    },
    {
      path: '/',
      component: '@/layouts/index',
      routes: [
        {
          path: '/',
          // redirect: '/setting/globalOptionsSet',
          // redirect: '/setting/sampleFieldCustom',
        },
        {
          path: '/setting',
          name: 'setting',
          routes: [
            // {
            //   path: '/setting/index',
            //   component: '@/pages/Setting',
            //   title: '设置页面',
            // },
            {
              path: '/setting/roleMange',
              component: '@/pages/Setting/subPages/roleMange',
              title: '设置/人员管理',
              routes: [
                {
                  path: `/setting/roleMange`,
                  redirect: `/setting/roleMange/index/-1`,
                },
                {
                  path: `/setting/roleMange/index/:id`,
                  component: '@/pages/Setting/subPages/roleMange/components/RightContent',
                  title: '设置/人员管理',
                },
              ],
            },
            {
              path: '/setting/organize',
              component: '@/pages/Setting/subPages/organizeInstitution',
              title: '设置/角色管理',
            },
            {
              path: '/setting/permissionMange',
              component: '@/pages/Setting/subPages/permissionMange',
              title: '设置/权限管理',
            },

            {
              path: '/setting/globalOptionsSet',
              component: '@/pages/Setting/subPages/globalOptionsSet',
              title: '系统全局选项设置',
            },
            {
              path: '/setting/sampleFieldCustom',
              component: '@/pages/Setting/subPages/sampleFieldCustom',
              title: '标本字段设置',
            },
            {
              path: '/setting/applicationFormModel',
              component: '@/pages/Setting/subPages/applicationFormModel',
              title: '组件模块设置',
            },
            {
              path: '/setting/sampleFieldCustom/:id',
              component: '@/pages/Setting/subPages/sampleFieldCustom',
              title: '自定义组件',
            },
          ],
        },
        {
          path: '/commonMaterials',
          name: 'commonMaterials',
          routes: [
            {
              path: '/commonMaterials/inspectionInstruments',
              component: '@/pages/CommonMaterials/subPages/inspectionInstruments',
              title: '检验仪器维护',
            },
            {
              path: '/commonMaterials/basicData',
              component: '@/pages/CommonMaterials/subPages/basicData',
              title: '基础资料',
            },
            {
              path: '/commonMaterials/specimen/:id',
              component: '@/pages/CommonMaterials/subPages/basicData/specimen',
              title: '基础资料',
            },
            {
              path: '/commonMaterials/majorGroup',
              component: '@/pages/CommonMaterials/subPages/majorGroup',
              title: '专业分类',
            },
            {
              path: '/commonMaterials/taskGroup',
              component: '@/pages/CommonMaterials/subPages/taskGroup',
              title: '任务分类',
            },
            {
              path: '/commonMaterials/inspectionUnit',
              component: '@/pages/CommonMaterials/subPages/inspectionUnit',
              title: '送检单位',
            },
            {
              path: '/commonMaterials/manageGroup',
              component: '@/pages/CommonMaterials/subPages/manageGroup',
              title: '管理分类',
            },
            {
              path: '/commonMaterials/applyProjectGroup',
              component: '@/pages/CommonMaterials/subPages/applyProjectGroup',
              title: '申请项目分类',
            },
            {
              path: '/commonMaterials/applyReportPC',
              component: '@/pages/CommonMaterials/subPages/applyReportPC',
              title: '申请项目和报告项目对照',
            },
            {
              path: '/commonMaterials/insUnitDiscount',
              component: '@/pages/CommonMaterials/subPages/insUnitDiscount',
              title: '运检单位折扣维护',
            },
            {
              path: '/commonMaterials/reportingUnit',
              component: '@/pages/CommonMaterials/subPages/reportingUnit',
              title: '报告单元',
            },
          ],
        },
        {
          path: '/preProcessingMag',
          name: 'preProcessingMag',
          routes: [
            {
              path: '/preProcessingMag/sampleRegistration',
              component: '@/pages/PreProcessingMag/subPages/sampleRegistration',
              title: '样本登记列表',
            },
            {
              path: '/preProcessingMag/applicationForm',
              component: '@/pages/PreProcessingMag/subPages/applicationForm',
              title: '申请单核对',
            },
            {
              path: '/preProcessingMag/sampleRegistration/addOrEdit/:id/:type',
              component:
                '@/pages/PreProcessingMag/subPages/sampleRegistration/components/AddOrEdit',
              title: '样本登新增',
            },
            {
              path: '/preProcessingMag/sampleSortingt',
              component: '@/pages/PreProcessingMag/subPages/sampleSorting',
              title: '样本分检',
            },
            {
              path: '/preProcessingMag/bloodSeparationMag',
              component: '@/pages/PreProcessingMag/subPages/bloodSeparationMag',
              title: '分血管理',
            },
            {
              path: '/preProcessingMag/sampleHandover',
              component: '@/pages/PreProcessingMag/subPages/sampleHandover',
              title: '分血管理',
            },
          ],
        },
        {
          path: '/generalInspectionMag',
          name: 'generalInspectionMag',
          routes: [
            {
              path: '/generalInspectionMag/singleInstruments',
              component: '@/pages/GeneralInspectionMag/subPages/singleInstruments',
              title: '单仪器',
            },
            {
              path: '/generalInspectionMag/multiInstrument',
              component: '@/pages/GeneralInspectionMag/subPages/multiInstrument',
              title: '单仪器',
            },
          ],
        },
      ],
    },
  ],
};
