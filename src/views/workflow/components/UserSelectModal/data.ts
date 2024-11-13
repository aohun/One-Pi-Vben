import { BasicColumn } from '@/components/Table';
import { FormSchema } from '@/components/Form';
import { DictEnum } from '@/enums/dictEnum';
import { useRender } from '@/hooks/component/useRender';

const { renderDict } = useRender();
export const columns: BasicColumn[] = [
  {
    dataIndex: 'userName',
    title: '名称',
  },
  {
    dataIndex: 'nickName',
    title: '昵称',
  },
  {
    dataIndex: 'avatar',
    title: '头像',
    width: 80,
  },
  {
    dataIndex: 'deptName',
    title: '部门',
  },
  {
    dataIndex: 'phonenumber',
    title: '手机号',
  },
  {
    dataIndex: 'status',
    title: '状态',
    customRender({ value }) {
      return renderDict(value, DictEnum.NORMAL_DISABLE);
    },
  },
  {
    dataIndex: 'createTime',
    title: '创建时间',
  },
];

export const schemas: FormSchema[] = [
  {
    field: 'userName',
    label: '用户账号',
    component: 'Input',
  },
  {
    field: 'phonenumber',
    label: '手机号码',
    component: 'Input',
  },
];
