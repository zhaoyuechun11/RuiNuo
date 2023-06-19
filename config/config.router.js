export default {
  routes: [
    // {
    //   path: '/auth',
    //   exact: true,
    //   component: '@/pages/Other/auth',
    //   title: '暂无权限',
    // },
    // {
    //   path: '/timeOut',
    //   exact: true,
    //   component: '@/pages/Other/timeOut',
    //   title: '试用期过期',
    // },
    // {
    //   path: '/serverOut',
    //   exact: true,
    //   component: '@/pages/Other/serverout',
    //   title: '应用服务过期',
    // },
    // {
    //   path: '/role',
    //   exact: true,
    //   component: '@/pages/Other/role',
    //   title: '选择角色',
    // },
    {
      path: '/login',
      exact: true,
      // component: '@/pages/Other/login',
      component: '@/pages/CommonMaterials/subPages/insUnitDiscount',
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

      //  redirect: '/',
      routes: [
        {
          path: '/',
          // redirect: '/workPlatform/index',
          redirect: '/setting/index',
        },
        {
          path: '/setting',
          name: 'setting',
          routes: [
            {
              path: '/setting/index',
              component: '@/pages/Setting',
              title: '设置页面',
            },
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
              path: '/setting/standardResume',
              component: '@/pages/Setting/subPages/standardResume',
              title: '设置/标准简历',
            },
          ],
        },
        {
          path: '/commonMaterials',
          name: 'commonMaterials',
          routes: [
            // {
            //   path: '/commonMaterials/index',
            //   component: '@/pages/CommonMaterials',
            //   title: '常用资料设置',
            // },
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
          ],
        },
      ],
    },
  ],
};
