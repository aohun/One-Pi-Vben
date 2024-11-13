import { BasicColumn } from '@/components/Table';
import { FormSchema } from '@/components/Form';
import { useRender } from '@/hooks/component/useRender';

const { renderTag } = useRender();
export const columns: BasicColumn[] = [
  {
    dataIndex: 'name',
    title: '模型名称',
  },
  {
    dataIndex: 'key',
    title: '模型key',
  },
  {
    dataIndex: 'version',
    title: '版本号',
    customRender({ value }) {
      return renderTag(`V${value}.0`, 'blue');
    },
  },
  {
    dataIndex: 'metaInfo',
    title: '备注',
  },
  {
    dataIndex: 'createTime',
    title: '创建时间',
  },
  {
    dataIndex: 'lastUpdateTime',
    title: '更新时间',
  },
];

export const schemas: FormSchema[] = [
  {
    field: 'name',
    label: '模型名称',
    component: 'Input',
  },
  {
    field: 'key',
    label: '模型key',
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
    label: 'xml',
    field: 'xml',
    component: 'Input',
    show: false,
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
