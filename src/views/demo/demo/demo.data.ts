import { BasicColumn } from '@/components/Table';
import { FormSchema } from '@/components/Form';

export const formSchems: FormSchema[] = [
  {
    label: '部门id',
    field: 'deptId',
    component: 'Input',
  },
  {
    label: '用户id',
    field: 'userId',
    component: 'Input',
  },
  {
    label: '排序号',
    field: 'orderNum',
    component: 'Input',
  },
  {
    label: 'key键',
    field: 'testKey',
    component: 'Input',
  },
  {
    label: '值',
    field: 'value',
    component: 'Input',
  },
];

export const columns: BasicColumn[] = [
  {
    title: '主键',
    dataIndex: 'id',
  },
  {
    title: '部门id',
    dataIndex: 'deptId',
  },
  {
    title: '用户id',
    dataIndex: 'userId',
  },
  {
    title: '排序号',
    dataIndex: 'orderNum',
  },
  {
    title: 'key键',
    dataIndex: 'testKey',
  },
  {
    title: '值',
    dataIndex: 'value',
  },
];

export const modalSchemas: FormSchema[] = [
  {
    label: '主键',
    field: 'id',
    required: true,
    component: 'Input',
    show: false,
  },
  {
    label: '部门id',
    field: 'deptId',
    required: true,
    component: 'Input',
  },
  {
    label: '用户id',
    field: 'userId',
    required: true,
    component: 'Input',
  },
  {
    label: '排序号',
    field: 'orderNum',
    required: true,
    component: 'Input',
  },
  {
    label: 'key键',
    field: 'testKey',
    required: true,
    component: 'Input',
  },
  {
    label: '值',
    field: 'value',
    required: true,
    component: 'Input',
  },
];
