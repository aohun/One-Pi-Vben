import { BasicColumn } from '@/components/Table';
import { FormSchema } from '@/components/Form';
import { useRender } from '@/hooks/component/useRender';
import { DictEnum } from '@/enums/dictEnum';

const { renderDict } = useRender();
export const columns: BasicColumn[] = [
  {
    dataIndex: 'processDefinitionName',
    title: '流程名称',
  },
  {
    dataIndex: 'processDefinitionKey',
    title: '流程key',
  },
  {
    dataIndex: 'processDefinitionVersion',
    title: '版本号',
    customRender({ value }) {
      return `V${value}.0`;
    },
  },
  // {
  //   dataIndex: 'businessStatus',
  //   title: '状态',
  //   customRender({ value }) {
  //     return renderTag(value);
  //   },
  // },
  {
    dataIndex: 'businessStatus',
    title: '流程状态',
    customRender({ value }) {
      return renderDict(value, DictEnum.WF_BUSINESS_STATUS);
    },
  },
  {
    dataIndex: 'startTime',
    title: '启动时间',
  },
];

export const schemas: FormSchema[] = [
  {
    field: 'name',
    label: '流程名称',
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
