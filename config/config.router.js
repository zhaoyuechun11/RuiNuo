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
              path: '/setting/applicationFormModel',
              component: '@/pages/Setting/subPages/applicationFormModel',
              title: '申请单模块管理',
            },
            {
              path: '/setting/sampleFieldCustom/:id/:type',
              component: '@/pages/Setting/subPages/sampleFieldCustom',
              title: '自定义字段',
            },
            {
              path: '/setting/geneInsRepModel',
              component: '@/pages/Setting/subPages/geneInsRepModel',
              title: '普检报告单元名管理',
            },
            {
              path: '/setting/geneInsRepDetailModel',
              component: '@/pages/Setting/subPages/geneInsRepDetailModel',
              title: '普检报告数据项目详情模块管理',
            },
            {
              path: '/setting/geneInsRepListModel',
              component: '@/pages/Setting/subPages/geneInsRepListModel',
              title: '普检报告数据列表模块管理',
            },
            {
              path: '/setting/reportTemplateModel',
              component: '@/pages/Setting/subPages/reportTemplateModel',
              title: '报告模版导出模块管理',
            },
            {
              path: '/setting/batchInputTemplate',
              component: '@/pages/Setting/subPages/batchInputTemplate',
              title: '批录入方式维护',
            },
            {
              path: '/Setting/batchInputTemplateDetail/:id',
              component: '@/pages/Setting/subPages/batchInputTemplate/batchInputTemplateDetail',
              title: '批录入详情',
            },
            {
              path: '/setting/entryMaintenance',
              component: '@/pages/Setting/subPages/entryMaintenance',
              title: '词条维护',
            },
            {
              path: '/setting/customProcess',
              component: '@/pages/Setting/subPages/customProcess',
              title: '新建流程',
            },
            {
              path: '/setting/updateCustomProcess/:id',
              component: '@/pages/Setting/subPages/updateCustomProcess',
              title: '查看流程',
            },
            {
              path: '/setting/processMange',
              component: '@/pages/Setting/subPages/processMange',
              title: '流程自定义管理',
            },
            {
              path: '/setting/processClassification',
              component: '@/pages/Setting/subPages/processClassification',
              title: '适用流程对照',
            },
            {
              path: '/setting/department',
              component: '@/pages/Setting/subPages/department',
              title: '部门管理',
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
              path: '/commonMaterials/instrProjectMaintenance',
              component: '@/pages/CommonMaterials/subPages/instrProjectMaintenance',
              title: '仪器项目维护',
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
              title: '样本交接',
            },
            {
              path: '/preProcessingMag/sampleReceipt',
              component: '@/pages/PreProcessingMag/subPages/sampleReceipt',
              title: '样本签收',
            },
            {
              path: '/preProcessingMag/receiptForm',
              component: '@/pages/PreProcessingMag/subPages/receiptForm',
              title: '签收单',
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
              title: '多仪器',
            },
            {
              path: '/generalInspectionMag/manualExperiments',
              component: '@/pages/GeneralInspectionMag/subPages/manualExperiments',
              title: '手工分配',
            },
            {
              path: '/generalInspectionMag/reportDataMag',
              component: '@/pages/GeneralInspectionMag/subPages/reportDataMag',
              title: '普检数据报告管理',
            },
            {
              path: '/generalInspectionMag/sampleTraceability/:id',
              component:
                '@/pages/GeneralInspectionMag/subPages/reportDataMag/commones/sampleTraceability',
              title: '样本溯源',
            },
          ],
        },
        {
          path: '/applicationFormMsg',
          name: 'applicationFormMsg',
          routes: [
            {
              path: '/applicationFormMsg/applyFormSearch',
              component: '@/pages/ApplicationFormMsg/subPages/applyFormSearch',
              title: '申请单查询',
            },
          ],
        },
        {
          path: '/reportMag',
          name: 'reportMag',
          routes: [
            {
              path: '/reportMag/reportReview',
              component: '@/pages/ReportMag/subPages/reportReview',
              title: '报告单审核',
            },
            {
              path: '/reportMag/reportCompreQuery',
              component: '@/pages/ReportMag/subPages/reportCompreQuery',
              title: '报告综合查询',
            },
            {
              path: '/reportMag/reportPrintByHospital',
              component: '@/pages/ReportMag/subPages/reportPrintByHospital',
              title: '报告按医院打印',
            },
          ],
        },
        {
          path: '/experTaskNavigation',
          name: 'experTaskNavigation',
          routes: [
            {
              path: '/experTaskNavigation/task',
              component: '@/pages/ExperTaskNavigation/subPages/task',
              title: '实验任务导航',
            },
            {
              path: '/experTaskNavigation/batchTask/:classId/:nodeId/:flowId/:route',
              component: '@/pages/ExperTaskNavigation/subPages/batchTask',
              title: '任务批处理',
            },
          ],
        },
        {
          path: '/handoverMsg',
          name: 'handoverMsg',
          routes: [
            {
              path: '/handoverMsg/handoverRegistration',
              component: '@/pages/HandoverMsg/subPages/handoverRegistration',
              title: '交接单登记',
            },
            {
              path: '/handoverMsg/handoverProcessCount',
              component: '@/pages/HandoverMsg/subPages/handoverProcessCount',
              title: '交接单统计',
            },
            {
              path: '/handoverMsg/handoverOrderProcess',
              component: '@/pages/HandoverMsg/subPages/handoverOrderProcess',
              title: '交接单处理',
            },
          ],
        },
        {
          path: '/customerServiceMsg',
          name: 'customerServiceMsg',
          routes: [
            {
              path: '/customerServiceMsg/consultationRegistration',
              component: '@/pages/CustomerServiceMsg/subPages/consultationRegistration',
              title: '咨询管理登记',
            },
            {
              path: '/customerServiceMsg/consultationFormStatistics',
              component: '@/pages/CustomerServiceMsg/subPages/consultationFormStatistics',
              title: '咨询统计',
            },
            {
              path: '/handoverMsg/handoverOrderProcess',
              component: '@/pages/HandoverMsg/subPages/handoverOrderProcess',
              title: '交接单处理',
            },
          ],
        },
        {
          path: '/indoorQualityControMsg',
          name: 'indoorQualityControMsg',
          routes: [
            {
              path: '/indoorQualityControMsg/qualityControlPRJ',
              component: '@/pages/IndoorQualityControMsg/subPages/qualityControlPRJ',
              title: '质控项目维护',
            },
            {
              path: '/indoorQualityControMsg/qualityControlProduct',
              component: '@/pages/IndoorQualityControMsg/subPages/qualityControlProduct',
              title: '质控品维护',
            },
            {
              path: '/indoorQualityControMsg/specimen/:id/:labClassId',
              component: '@/pages/IndoorQualityControMsg/subPages/qualityControlProduct/specimen',
              title: '适用质控品项目',
            },
            {
              path: '/indoorQualityControMsg/targetValueSetting',
              component: '@/pages/IndoorQualityControMsg/subPages/targetValueSetting',
              title: '质控靶值设定',
            },
            {
              path: '/indoorQualityControMsg/qualityControlRules',
              component: '@/pages/IndoorQualityControMsg/subPages/qualityControlRules',
              title: '质控规则设置',
            },
            {
              path: '/indoorQualityControMsg/QCDataConversionRules',
              component: '@/pages/IndoorQualityControMsg/subPages/QCDataConversionRules',
              title: '质控数据转化规则',
            },
            {
              path: '/indoorQualityControMsg/QCDCollectionControl',
              component: '@/pages/IndoorQualityControMsg/subPages/QCDCollectionControl',
              title: '质控数据采集对照',
            },
            {
              path: '/indoorQualityControMsg/QCDataMaintenance',
              component: '@/pages/IndoorQualityControMsg/subPages/QCDataMaintenance',
              title: '质控数据维护',
            },
          ],
        },
      ],
    },
  ],
};
