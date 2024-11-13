import { FormSchema } from '@/components/Form';

export const messageTypeOptions = [
  { value: '1', label: '站内信', disabled: true },
  { value: '2', label: '邮箱' },
  { value: '3', label: '短信' },
];
export const modalSchemas: FormSchema[] = [
  {
    label: 'taskId',
    component: 'Input',
    field: 'taskId',
    show: false,
  },
  {
    label: '消息提醒',
    field: 'messageType',
    component: 'CheckboxGroup',
    defaultValue: ['1'],
    componentProps: {
      options: messageTypeOptions,
    },
  },
  {
    label: '审批意见',
    component: 'InputTextArea',
    field: 'message',
    componentProps: {
      placeholder: '输入审批意见',
      rows: 3,
    },
  },
  {
    label: '抄送',
    field: 'wfCopyList',
    slot: 'wfCopyList',
  },
  // "1765352333063180289,1765352346031968257" string类型 ,分割
  {
    label: '附件',
    field: 'fileId',
    slot: 'fileId',
  },
];

/**
 * {"messageType":["1"],"targetActivityId":"Activity_14633hx","message":"退回测试","taskId":"1785507672433569793"}
 */
export const rejectModalSchemas: FormSchema[] = [
  {
    label: 'taskId',
    component: 'Input',
    field: 'taskId',
    show: false,
  },
  {
    label: '消息提醒',
    field: 'messageType',
    component: 'CheckboxGroup',
    defaultValue: ['1'],
    componentProps: {
      options: messageTypeOptions,
    },
  },
  {
    label: '驳回节点',
    component: 'Select',
    field: 'targetActivityId',
    required: true,
  },
  {
    label: '审批意见',
    component: 'InputTextArea',
    field: 'message',
    componentProps: {
      placeholder: '输入审批意见',
      rows: 3,
    },
  },
];
