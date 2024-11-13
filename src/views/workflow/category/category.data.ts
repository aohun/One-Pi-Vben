import { BasicColumn } from '@/components/Table';
import { FormSchema } from '@/components/Form';

export const columns: BasicColumn[] = [
  {
    dataIndex: 'categoryName',
    title: '分类名称',
  },
  {
    dataIndex: 'categoryCode',
    title: '分类编码',
  },
  {
    dataIndex: 'sortNum',
    title: '排序',
  },
];

export const formSchemas: FormSchema[] = [
  {
    field: 'categoryName',
    label: '分类名称',
    component: 'Input',
  },
  {
    field: 'categoryCode',
    label: '分类编码',
    component: 'Input',
  },
];

export const modalSchemas: FormSchema[] = [
  {
    field: 'id',
    label: 'id',
    component: 'Input',
    show: false,
  },
  {
    field: 'parentId',
    label: '父级分类',
    required: true,
    defaultValue: 0,
    component: 'TreeSelect',
  },
  {
    field: 'categoryName',
    label: '分类名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'categoryCode',
    label: '分类编码',
    component: 'Input',
    required: true,
  },
  {
    field: 'sortNum',
    label: '排序',
    component: 'InputNumber',
    required: false,
  },
];
