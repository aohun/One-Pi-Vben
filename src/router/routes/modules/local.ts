import type { AppRouteModule } from '@/router/types';
import { LAYOUT } from '@/router/constant';

/**
 * 这里放本地路由  就是后台没有包含的
 * 默认登录后才能访问
 * 白名单路径: router/guard/permissionGuard.ts
 * 注意 component: LAYOUT 一定要有
 */
export const localRoutes: AppRouteModule[] = [
  {
    path: '/social-callback',
    name: 'socialCallback',
    component: () => import('@/views/auth/social-callback/index.vue'),
    meta: {
      title: '授权登录页',
    },
  },
  {
    component: LAYOUT,
    path: '/system/oss-config',
    name: 'OssConfigRoot',
    meta: { title: 'OSS配置管理' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/system/oss/OssConfig.vue'),
        name: 'OssConfig',
        meta: {
          hidden: true,
          title: 'OSS配置管理',
          currentActiveMenu: '/system/oss',
        },
      },
    ],
  },
  {
    component: LAYOUT,
    path: '/workflow/leaveEdit',
    name: 'WorkflowLeave',
    meta: { title: '请假信息' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/workflow/leave/LeaveFormTest.vue'),
        name: 'WorkflowLeaveIndex',
        meta: {
          hidden: true,
          title: '请假信息',
          currentActiveMenu: '/demo/leave',
        },
      },
    ],
  },
  {
    component: LAYOUT,
    path: '/demo/purchaseEdit',
    name: 'SubForm',
    meta: { title: '采购申请' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/demo/subform/SubFormTest.vue'),
        name: 'SubFormIndex',
        meta: {
          hidden: true,
          title: '采购申请',
          currentActiveMenu: '/demo/purchase',
        },
      },
    ],
  },
  {
    component: LAYOUT,
    path: '/tool/generate',
    name: 'ToolRoute',
    meta: {
      title: '修改生成配置',
      hidden: true,
    },
    children: [
      {
        path: 'edit/:tableId',
        component: () => import('@/views/tool/gen/EditGenerate.vue'),
        name: 'EditGenerate',
        meta: {
          hidden: true,
          title: '修改生成配置',
          currentActiveMenu: '/tool/gen',
        },
      },
    ],
  },
  {
    component: LAYOUT,
    path: '/account',
    name: 'AccountInfo',
    redirect: '/setting',
    meta: {
      hideMenu: true,
      title: '账号',
    },
    children: [
      {
        path: 'setting',
        name: 'AccountSettingPage',
        component: () => import('@/views/auth/profile/index.vue'),
        meta: {
          title: '个人设置',
        },
      },
    ],
  },
  {
    component: LAYOUT,
    path: '/system/assign-roles',
    name: 'AssignRolesRoot',
    redirect: '/:roleId',
    meta: {
      hideMenu: true,
      title: '分配角色',
    },
    children: [
      {
        path: ':roleId',
        name: 'AssignRoles',
        component: () => import('@/views/system/role/AssignRoles/index.vue'),
        meta: {
          title: '分配角色',
          currentActiveMenu: '/system/role',
        },
      },
    ],
  },
  {
    component: LAYOUT,
    path: '/workflow/definition/history',
    name: 'WorkflowDefinitionHistory',
    redirect: '/:key',
    meta: {
      hideMenu: true,
      title: '历史记录',
    },
    children: [
      {
        path: ':key',
        name: 'WorkflowDefinitionHistoryPage',
        component: () => import('@/views/workflow/processDefinition/history/index.vue'),
        meta: {
          title: '历史记录',
          currentActiveMenu: '/workflow/processDefinition',
        },
      },
    ],
  },
  {
    component: LAYOUT,
    path: '/workflow/design',
    name: 'BpmnDesign',
    redirect: '/:id',
    meta: {
      hideMenu: true,
      title: '流程设计',
    },
    children: [
      {
        path: ':id',
        name: 'BpmnDesignPage',
        component: () => import('@/views/workflow/components/BpmnDesign/index.vue'),
        meta: {
          title: '流程设计',
          currentActiveMenu: '/workflow/model',
        },
      },
    ],
  },
];
