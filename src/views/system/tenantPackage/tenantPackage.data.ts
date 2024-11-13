import { BasicColumn } from '@/components/Table';
import { FormSchema } from '@/components/Form';

export const columns: BasicColumn[] = [
  {
    title: '套餐名称',
    dataIndex: 'packageName',
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
  {
    title: '租户状态',
    dataIndex: 'status',
  },
];

export const formSchemas: FormSchema[] = [
  {
    label: '套餐名称',
    field: 'packageName',
    component: 'Input',
  },
];

export const modalSchemas: FormSchema[] = [
  {
    label: '套餐ID',
    field: 'packageId',
    component: 'Input',
    show: false,
  },
  {
    label: '节点关联',
    field: 'menuCheckStrictly',
    component: 'Checkbox',
    show: false,
  },
  {
    label: '套餐名称',
    field: 'packageName',
    component: 'Input',
    required: true,
  },
  {
    label: '关联菜单',
    field: 'menuIds',
    defaultValue: [],
    slot: 'menuIds',
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
];

// 租户管理 不可分配  只有superadmin有权限操作 分配了也没用
export const excludeIds = [6, 121, 122, 1606, 1607, 1608, 1609, 1610, 1611, 1612, 1613, 1614, 1615];
