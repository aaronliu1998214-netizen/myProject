import { layout } from "@/app";

/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
    {
    path: '/welcome',
    name: '欢迎页',
    icon: 'dashboard',
    component: './Welcome',
  },
  {
    path: '/efficiency',
    name: '效率首页',
    icon: 'dashboard',
    component: './efficiency',
  },
  {
    name: '物资管理',
    icon: 'database',
    path: '/materials',
    routes: [
      {
        path: '/materials',
        redirect: '/materials/dashboard',
      },
      {
        name: '物资台账首页',
        path: '/materials/dashboard',
        component: './materials/dashboard',
      },
      {
        name: '备品备件入库',
        path: '/materials/spare-parts',
        component: './materials/spare-parts',
      },
      {
        name: '材料设备入库',
        path: '/materials/equipment',
        component: './materials/equipment',
      },
      {
        name: '入库核验',
        path: '/materials/verification',
        component: './materials/verification',
      },
      {
        name: '出库申请',
        path: '/materials/outbound',
        component: './materials/outbound',
      },
      {
        name: '物资查询',
        path: '/materials/search',
        component: './materials/search',
      },
      {
        name: '数据分析',
        path: '/materials/analysis',
        component: './materials/analysis',
      },
      {
        name: '用户角色权限管理',
        path: '/materials/user-management',
        component: './materials/user-management',
      },
    ],
  },
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user/login',
        layout: false,
        name: 'login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/user',
    redirect: '/user/login',
  },
  {
    component: '404',
    path: '/*',
  },
  {
    path: '/',
    redirect: '/welcome',
  },

  {
    path: '/flow',
    name: '流程流转',
    icon: 'dashboard',
    component: './flow',
  },
  // {
  //   path:'/flowone',
  //   name:'单个流程流转',
  //   icon:'dashboard',
  //   component:'./flow/components/flowCompOne'
  // },
  // {
  //   name: '数据大屏',
  //   path: '/demo',
  //   component: './screen',
  //   layout: false
  // },
  // {
  //   name: '数据大屏',
  //   path: '/demo1',
  //   component: './screen copy',
  //   layout: false
  // },
  //   {
  //   name: '数据大屏',
  //   path: '/demo2',
  //   component: './screen',
  //   layout:false
  // },
  // {
  //   path:'/compcustom',
  //   name:'自定义组件',
  //   icon:'dashboard',
  //   routes: [
  //   // echart3d
  //   {
  //     name: '真实3d柱形图',
  //     path: '/compcustom/echart3d',
  //     component:'./compcustom/echart3d'
  //   },
  //   {
  //     name: '伪3d柱形图',
  //     path: '/compcustom/echart3d_1',
  //     component:'./compcustom/echart3d_1'
  //   },
  //   // echart3d_pie
  //   {
  //     name: '3d饼图',
  //     path: '/compcustom/echart3d_pie',
  //     component:'./compcustom/echart3d_pie'
  //   },
  // echart3d_pie_1
  // {
  //   name: '3d饼图_手写',
  //   path: '/compcustom/echart3d_pie_1',
  //   component:'./compcustom/echart3d_pie_1'
  // },
  // {
  //   name: 'echart重庆地图',
  //   path: '/compcustom/cqmap',
  //   component:'./compcustom/cqmap'
  // },
  // {
  //   name: 'echart重庆地图六边形',
  //   path: '/compcustom/cqmapL7',
  //   component:'./compcustom/cqmapL7'
  // },
  // {
  //   name: 'L7重庆散点地图',
  //   path: '/compcustom/cqsandian',
  //   component:'./compcustom/cqsandian'
  // },
  // {
  //   name: 'echart 3d重庆地图2',
  //   path: '/compcustom/demo',
  //   component:'./compcustom/demo'
  // },
  // {
  //   name: 'threeJs 3d重庆地图',
  //   path: '/compcustom/threeCq',
  //   component:'./compcustom/threeCq'
  // },
  // {
  //   name: 'L7 中国地图',
  //   path: '/compcustom/chinamap',
  //   component:'./compcustom/chinamap'
  // },
  // {
  //   name: 'L7 地球模型',
  //   path: '/compcustom/earth',
  //   component:'./compcustom/earth'
  // },
  // {
  //   name: '极坐标系下的堆叠柱状图',
  //   path: '/compcustom/stackedBar',
  //   component:'./compcustom/stackedBar'
  // },
  // {
  //   name: 'editer',
  //   path: '/compcustom/editer',
  //   component:'./compcustom/editer'
  // },
  // //viewData
  // {
  //   name: 'viewdata',
  //   path: '/compcustom/viewData',
  //   component:'./compcustom/viewData'
  // },
  //   ]
  // },
  {
    name: '真实3d柱形图',
    path: '/compcustom/echart3d',
    component: './compcustom/echart3d',
  },
  {
    name: '伪3d柱形图',
    path: '/compcustom/echart3d_1',
    component: './compcustom/echart3d_1',
  },
  // echart3d_pie
  {
    name: '3d饼图',
    path: '/compcustom/echart3d_pie',
    component: './compcustom/echart3d_pie',
  },
  // echart3d_pie_1
  {
    name: '3d饼图_3D',
    path: '/compcustom/echart3d_pie_1',
    component: './compcustom/echart3d_pie_1',
  },
  {
    name: 'echart重庆地图',
    path: '/compcustom/cqmap',
    component: './compcustom/cqmap',
  },
  {
    name: 'antVL7重庆地图六边形',
    path: '/compcustom/cqmapL7',
    component: './compcustom/cqmapL7',
  },
  {
    name: 'L7重庆散点地图',
    path: '/compcustom/cqsandian',
    component: './compcustom/cqsandian',
  },
  {
    name: 'echart 3d重庆地图2',
    path: '/compcustom/demo',
    component: './compcustom/demo',
  },
  {
    name: 'threeJs 3d重庆地图',
    path: '/compcustom/threeCq',
    component: './compcustom/threeCq',
  },
  {
    name: 'L7 中国地图',
    path: '/compcustom/chinamap',
    component: './compcustom/chinamap',
  },
  {
    name: 'L7 地球模型',
    path: '/compcustom/earth',
    component: './compcustom/earth',
  },
  {
    name: '极坐标系下的堆叠柱状图',
    path: '/compcustom/stackedBar',
    component: './compcustom/stackedBar',
  },
  {
    name: 'Three.js 地球模型',
    icon: 'smile',
    path: '/earthModal',
    component: './earthModal',
  },
  {
    name: '指标编辑器',
    path: '/compcustom/editer',
    icon: 'smile',
    component:'./compcustom/editer'
  },
  // //viewData
  {
    name: 'viewdata',
    path: '/compcustom/viewData',
    component:'./compcustom/viewData'
  },
  {
    name: '抗DOSS数据大屏',
    icon: 'smile',
    path: '/doss/screen',
    component: './doss/screen',
  },
  {
    name: '研发效率数据大屏',
    icon: 'smile',
    path: '/effectbig',
    component: './effect',
    layout: false,
  },
  {
    name: '研发效率数据大屏',
    icon: 'smile',
    path: '/effect',
    component: './effect/leader',
  },
  {
    path: '/doss/screen_big',
    name: 'srceenbig',
    icon: 'DashboardOutlined',
    component: './doss/screen',
    layout: false,
    hideInMenu: true,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    icon: 'dashboard',
    routes: [
      {
        path: '/dashboard',
        redirect: '/dashboard/analysis',
      },
      {
        name: 'analysis',
        icon: 'smile',
        path: '/dashboard/analysis',
        component: './dashboard/analysis',
      },
      {
        name: 'monitor',
        icon: 'smile',
        path: '/dashboard/monitor',
        component: './dashboard/monitor',
      },
      {
        name: 'workplace',
        icon: 'smile',
        path: '/dashboard/workplace',
        component: './dashboard/workplace',
      },
    ],
  },
  {
    path: '/form',
    icon: 'form',
    name: 'form',
    routes: [
      {
        path: '/form',
        redirect: '/form/basic-form',
      },
      {
        name: 'basic-form',
        icon: 'smile',
        path: '/form/basic-form',
        component: './form/basic-form',
      },
      {
        name: 'step-form',
        icon: 'smile',
        path: '/form/step-form',
        component: './form/step-form',
      },
      {
        name: 'advanced-form',
        icon: 'smile',
        path: '/form/advanced-form',
        component: './form/advanced-form',
      },
    ],
  },
  {
    path: '/list',
    icon: 'table',
    name: 'list',
    routes: [
      {
        path: '/list/search',
        name: 'search-list',
        component: './list/search',
        routes: [
          {
            path: '/list/search',
            redirect: '/list/search/articles',
          },
          {
            name: 'articles',
            icon: 'smile',
            path: '/list/search/articles',
            component: './list/search/articles',
          },
          {
            name: 'projects',
            icon: 'smile',
            path: '/list/search/projects',
            component: './list/search/projects',
          },
          {
            name: 'applications',
            icon: 'smile',
            path: '/list/search/applications',
            component: './list/search/applications',
          },
        ],
      },
      {
        path: '/list',
        redirect: '/list/table-list',
      },
      {
        name: 'table-list',
        icon: 'smile',
        path: '/list/table-list',
        component: './table-list',
      },
      {
        name: 'basic-list',
        icon: 'smile',
        path: '/list/basic-list',
        component: './list/basic-list',
      },
      {
        name: 'card-list',
        icon: 'smile',
        path: '/list/card-list',
        component: './list/card-list',
      },
    ],
  },
  {
    path: '/profile',
    name: 'profile',
    icon: 'profile',
    routes: [
      {
        path: '/profile',
        redirect: '/profile/basic',
      },
      {
        name: 'basic',
        icon: 'smile',
        path: '/profile/basic',
        component: './profile/basic',
      },
      {
        name: 'advanced',
        icon: 'smile',
        path: '/profile/advanced',
        component: './profile/advanced',
      },
    ],
  },
  {
    name: 'result',
    icon: 'CheckCircleOutlined',
    path: '/result',
    routes: [
      {
        path: '/result',
        redirect: '/result/success',
      },
      {
        name: 'success',
        icon: 'smile',
        path: '/result/success',
        component: './result/success',
      },
      {
        name: 'fail',
        icon: 'smile',
        path: '/result/fail',
        component: './result/fail',
      },
    ],
  },
  {
    name: 'exception',
    icon: 'warning',
    path: '/exception',
    routes: [
      {
        path: '/exception',
        redirect: '/exception/403',
      },
      {
        name: '403',
        icon: 'smile',
        path: '/exception/403',
        component: './exception/403',
      },
      {
        name: '404',
        icon: 'smile',
        path: '/exception/404',
        component: './exception/404',
      },
      {
        name: '500',
        icon: 'smile',
        path: '/exception/500',
        component: './exception/500',
      },
    ],
  },
  {
    name: 'account',
    icon: 'user',
    path: '/account',
    routes: [
      {
        path: '/account',
        redirect: '/account/center',
      },
      {
        name: 'center',
        icon: 'smile',
        path: '/account/center',
        component: './account/center',
      },
      {
        name: 'settings',
        icon: 'smile',
        path: '/account/settings',
        component: './account/settings',
      },
    ],
  },
  {
    path: '/',
    redirect: '/dashboard/analysis',
  },
  {
    component: '404',
    path: '/*',
  },
  {
    name: '计时器demo',
    icon: 'smile',
    path: '/timerDemo',
    component: './timerDemo',
  },
  {
    name: '自适应-flex',
    icon: 'smile',
    path: '/mediaQueries',
    component: './mediaQueries',
  },
  {
    name: '自适应-栅格',
    icon: 'smile',
    path: '/mediaQueries2',
    component: './mediaQueries2',
  },
  {
    name: '漫游指引',
    icon: 'smile',
    path: '/tourProps',
    component: './tourProps',
  },
  {
    name: 'ChatUI',
    icon: 'smile',
    path: '/chatUI',
    component: './chatUI',
  },
  {
    name: '车牌号输入',
    icon: 'smile',
    path: '/carInput',
    component: './cartInput',
  },
];
