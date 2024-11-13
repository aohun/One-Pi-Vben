import { BasicColumn } from '@/components/Table';
import { FormSchema, commonRules } from '@/components/Form';
import dayjs from 'dayjs';

export const columns: BasicColumn[] = [
  {
    title: '租户编号',
    dataIndex: 'tenantId',
  },
  {
    title: '租户名称',
    dataIndex: 'companyName',
  },
  {
    title: '联系人',
    dataIndex: 'contactUserName',
  },
  {
    title: '联系电话',
    dataIndex: 'contactPhone',
  },
  {
    title: '到期时间',
    dataIndex: 'expireTime',
    customRender({ value }) {
      if (!value) {
        return '无期限';
      }
      return value;
    },
  },
  {
    title: '租户状态',
    dataIndex: 'status',
  },
];

export const formSchemas: FormSchema[] = [
  {
    field: 'tenantId',
    label: '租户编号',
    component: 'Input',
  },
  {
    field: 'companyName',
    label: '租户名称',
    component: 'Input',
  },
  {
    field: 'contactUserName',
    label: '联系人',
    component: 'Input',
  },
  {
    field: 'contactPhone',
    label: '联系电话',
    component: 'Input',
  },
];

const defaultExpireTime = dayjs(new Date())
  .add(365, 'days')
  .startOf('day')
  .format('YYYY-MM-DD HH:mm:ss');
export const modalSchemas: FormSchema[] = [
  {
    field: 'id',
    label: 'id',
    component: 'Input',
    show: false,
  },
  {
    field: 'tenantId',
    label: '租户编号',
    component: 'Input',
    show: false,
  },
  {
    field: 'companyName',
    label: '企业名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'contactUserName',
    label: '联系人',
    component: 'Input',
    required: true,
  },
  {
    field: 'contactPhone',
    label: '联系电话',
    component: 'Input',
    rules: commonRules('phone', true),
  },
  {
    field: 'username',
    label: '用户账号',
    component: 'Input',
    required: true,
    ifShow: ({ model }) => !model.tenantId,
  },
  {
    field: 'password',
    label: '用户密码',
    component: 'InputPassword',
    required: true,
    ifShow: ({ model }) => !model.tenantId,
  },
  {
    field: 'packageId',
    label: '租户套餐',
    component: 'Select',
  },
  {
    field: 'expireTime',
    label: '过期时间',
    helpMessage: [
      `已经设置过期时间不允许重置为'无期限'`,
      '即在开通时未设置无期限 以后都不允许设置',
    ],
    component: 'DatePicker',
    defaultValue: defaultExpireTime,
    componentProps: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    field: 'accountCount',
    label: '用户数量',
    component: 'InputNumber',
    defaultValue: -1,
    helpMessage: '-1不限制用户数量',
    componentProps: {
      min: -1,
    },
    renderComponentContent({ model }) {
      return {
        addonBefore: () => (model.accountCount == -1 ? '不限制数量' : '输入数量'),
      };
    },
  },
  {
    field: 'domain',
    label: '绑定域名',
    component: 'Input',
    helpMessage: [
      '可填写域名/端口, 不需要http(s)://',
      '填写域名如: www.test.com 或者 www.test.com:8080',
      '填写ip:端口如: 127.0.0.1:8080',
    ],
  },
  {
    field: 'address',
    label: '企业地址',
    component: 'Input',
  },
  {
    field: 'licenseNumber',
    label: '企业代码',
    component: 'Input',
  },
  {
    field: 'intro',
    label: '企业介绍',
    component: 'InputTextArea',
  },
  {
    field: 'remark',
    label: '备注',
    component: 'InputTextArea',
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    defaultValue: '0',
    show: false,
  },
];
