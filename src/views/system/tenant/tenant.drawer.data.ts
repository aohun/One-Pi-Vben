import { FormSchema, commonRules } from '@/components/Form';

import dayjs from 'dayjs';

const defaultExpireTime = dayjs(new Date())
  .add(365, 'days')
  .startOf('day')
  .format('YYYY-MM-DD HH:mm:ss');
/** 抽屉使用 */
export const drawerSchemas: FormSchema[] = [
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
  // 分割线
  {
    field: 'Divider_1',
    component: 'Divider',
    label: '基本信息',
    componentProps: {
      orientation: 'center',
    },
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
  // 分割线
  {
    field: 'Divider_2',
    component: 'Divider',
    label: '管理员信息',
    componentProps: {
      orientation: 'center',
    },
    ifShow: ({ model }) => !model.tenantId,
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
  // 分割线
  {
    field: 'Divider_3',
    component: 'Divider',
    label: '租户设置',
    componentProps: {
      orientation: 'center',
    },
  },
  {
    field: 'packageId',
    label: '租户套餐',
    required: true,
    slot: 'packageSelect',
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
    colProps: {
      xs: 24,
      sm: 24,
      md: 12,
      lg: 12,
      xl: 12,
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
    colProps: {
      xs: 24,
      sm: 24,
      md: 12,
      lg: 12,
      xl: 12,
    },
  },
  {
    field: 'domain',
    label: '绑定域名',
    component: 'Input',
    helpMessage: [
      '可填写域名/端口',
      '填写域名如: www.test.com 或者 www.test.com:8080',
      '填写ip:端口如: 127.0.0.1:8080',
    ],
    componentProps: {
      addonBefore: 'http(s)://',
    },
    rules: [
      {
        required: false,
        message: '绑定域名不需要带http(s)://',
        trigger: 'change',
        validator(_, value) {
          if (value && (value.startsWith('http://') || value.startsWith('https://'))) {
            return Promise.reject(new Error('绑定域名不需要带http(s)://'));
          }
          return Promise.resolve();
        },
      },
    ],
  },
  // 分割线
  {
    field: 'Divider_4',
    component: 'Divider',
    label: '企业信息',
    componentProps: {
      orientation: 'center',
    },
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
