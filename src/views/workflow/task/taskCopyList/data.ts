import { BasicColumn } from '@/components/Table';
import { FormSchema } from '@/components/Form';
import { useRender } from '@/hooks/component/useRender';
import { DictEnum } from '@/enums/dictEnum';

const { renderTag, renderDict } = useRender();
export const columns: BasicColumn[] = [
  {
    dataIndex: 'processDefinitionName',
    title: '流程名称',
  },
  {
    dataIndex: 'processDefinitionKey',
    title: '流程KEY',
  },
  {
    dataIndex: 'name',
    title: '任务名称',
  },
  {
    dataIndex: 'assigneeName',
    title: '办理人',
    customRender({ value }) {
      return renderTag(value);
    },
  },
  {
    dataIndex: 'businessStatus',
    title: '流程状态',
    customRender({ value }) {
      return renderDict(value, DictEnum.WF_BUSINESS_STATUS);
    },
  },
];

export const schemas: FormSchema[] = [
  {
    field: 'name',
    label: '任务名称',
    component: 'Input',
  },
  {
    field: 'processDefinitionName',
    label: '流程名称',
    component: 'Input',
  },
  {
    field: 'processDefinitionKey',
    label: '流程KEY',
    component: 'Input',
  },
];
