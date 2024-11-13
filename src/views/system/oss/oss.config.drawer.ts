import { FormSchema } from '@/components/Form';
import { getDictOptions } from '@/utils/dict';
import { DictEnum } from '@/enums/dictEnum';

const accessPolicyOptions = [
  { label: 'private', value: '0', color: 'orange' },
  { label: 'public', value: '1', color: 'green' },
  { label: 'custom', value: '2', color: 'blue' },
];

export const drawerSchemas: FormSchema[] = [
  {
    label: 'id',
    field: 'ossConfigId',
    component: 'Input',
    show: false,
  },
  {
    label: '基本信息',
    field: 'baseInfo',
    component: 'Divider',
    componentProps: {
      orientation: 'center',
    },
  },
  {
    label: '配置名称',
    field: 'configKey',
    component: 'Input',
    required: true,
  },
  {
    label: '服务地址',
    field: 'endpoint',
    component: 'Input',
    helpMessage: '这里不需要填写http/https!!!, 加上无法预览/下载文件',
    rules: [
      { required: true, message: '请输入服务地址', trigger: 'blur' },
      {
        message: '不需要填写http(s)',
        trigger: 'blur',
        validator: (_rule, value: string) => {
          if (!value) {
            return Promise.resolve();
          }
          if (value.startsWith('http')) {
            return Promise.reject();
          }
          return Promise.resolve();
        },
      },
    ],
    componentProps({ formModel }) {
      return {
        addonBefore: formModel.isHttps === 'Y' ? 'https://' : 'http://',
      };
    },
  },
  {
    label: '自定义域名',
    field: 'domain',
    component: 'Input',
    rules: [{ required: false, message: '不需要带http/https协议', trigger: 'blur' }],
  },
  {
    label: '认证信息',
    field: 'accessInfo',
    component: 'Divider',
    componentProps: {
      orientation: 'center',
    },
  },
  {
    label: 'accessKey',
    field: 'accessKey',
    component: 'Input',
    required: true,
  },
  {
    label: 'secretKey',
    field: 'secretKey',
    component: 'Input',
    required: true,
  },
  {
    label: '其他信息',
    field: 'otherInfo',
    component: 'Divider',
    componentProps: {
      orientation: 'center',
    },
  },
  {
    label: '桶名称',
    field: 'bucketName',
    component: 'Input',
    required: true,
  },
  {
    label: '前缀',
    field: 'prefix',
    component: 'Input',
  },
  {
    label: '权限桶类型',
    field: 'accessPolicy',
    component: 'RadioButtonGroup',
    required: true,
    defaultValue: '0',
    componentProps: { options: accessPolicyOptions },
    colProps: {
      xs: 24,
      sm: 24,
      md: 24,
      lg: 12,
    },
  },
  {
    label: '是否https',
    field: 'isHttps',
    component: 'RadioButtonGroup',
    required: true,
    defaultValue: 'N',
    componentProps: {
      options: getDictOptions(DictEnum.YES_NO),
    },
    colProps: {
      xs: 24,
      sm: 24,
      md: 24,
      lg: {
        span: 10,
        offset: 2,
      },
    },
  },
  {
    label: '域',
    field: 'region',
    component: 'Input',
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
];
