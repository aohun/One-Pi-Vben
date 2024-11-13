import { BasicColumn } from '@/components/Table';
import { FormSchema } from '@/components/Form';
import { useRender } from '@/hooks/component/useRender';

const options = [
  { label: '挂起', value: '2', color: 'error' },
  { label: '激活', value: '1', color: 'processing' },
];

const { renderTag } = useRender();
export const columns: BasicColumn[] = [
  {
    dataIndex: 'name',
    title: '流程名称',
  },
  {
    dataIndex: 'key',
    title: '流程key',
  },
  {
    dataIndex: 'version',
    title: '版本号',
    customRender({ value }) {
      return `V${value}.0`;
    },
  },
  {
    dataIndex: 'resourceName',
    title: '流程xml',
  },
  {
    dataIndex: 'diagramResourceName',
    title: '流程图片',
  },
  {
    dataIndex: 'suspensionState',
    title: '状态',
    customRender({ value }) {
      const current = options.find((item) => item.value == value);
      return renderTag(current?.label || value, current?.color);
    },
  },
  {
    dataIndex: 'deploymentTime',
    title: '部署时间',
  },
];

export const schemas: FormSchema[] = [
  {
    field: 'name',
    label: '流程名称',
    component: 'Input',
  },
  {
    field: 'key',
    label: '流程key',
    component: 'Input',
  },
];

export const modalSchemas: FormSchema[] = [
  {
    label: 'id',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '模型名称',
    field: 'name',
    component: 'Input',
    required: true,
    componentProps: {
      showCount: true,
      maxlength: 20,
    },
  },
  {
    label: '模型key',
    field: 'key',
    component: 'Input',
    required: true,
    componentProps: {
      showCount: true,
      maxlength: 20,
    },
  },
  {
    label: '流程分类',
    field: 'categoryCode',
    component: 'TreeSelect',
    required: true,
    // 这个代表顶级节点
    defaultValue: 'ALL',
  },
  {
    label: '备注',
    field: 'description',
    component: 'InputTextArea',
    componentProps: {
      rows: 3,
      showCount: true,
      maxlength: 200,
    },
  },
];
