import { BasicColumn } from '@/components/Table';
import { FormSchema } from '@/components/Form';

export const formSchems: FormSchema[] = [
  {
    label: '父id',
    field: 'parentId',
    component: 'Input',
  },
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
    label: '值',
    field: 'treeName',
    component: 'Input',
  },
];

export const columns: BasicColumn[] = [
  {
    title: '主键',
    dataIndex: 'id',
  },
  {
    title: '父id',
    dataIndex: 'parentId',
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
    title: '值',
    dataIndex: 'treeName',
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
    label: '父id',
    field: 'parentId',
    required: true,
    component: 'TreeSelect',
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
    label: '值',
    field: 'treeName',
    required: true,
    component: 'Input',
  },
];
