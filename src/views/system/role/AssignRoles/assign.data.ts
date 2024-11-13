import { BasicColumn } from '@/components/Table';
import { FormSchema } from '@/components/Form';

export const columns: BasicColumn[] = [
  {
    title: '用户账号',
    dataIndex: 'userName',
  },
  {
    title: '用户昵称',
    dataIndex: 'nickName',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
  },
  {
    title: '手机号',
    dataIndex: 'phonenumber',
  },
];

export const formSchemas: FormSchema[] = [
  {
    label: '用户账号',
    field: 'userName',
    component: 'Input',
  },
  {
    label: '手机号码',
    field: 'phonenumber',
    component: 'Input',
  },
];
