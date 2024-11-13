import { BasicColumn } from '@/components/Table';
import { FormSchema } from '@/components/Form';
import { useRender } from '@/hooks/component/useRender';
import { Tooltip } from 'ant-design-vue';
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
    customRender({ record }) {
      const { participantVo } = record;
      if (!participantVo) {
        return renderTag('未选择', 'red');
      }
      const { candidateName = [] } = participantVo;
      // 单个办理人
      if (candidateName.length === 1) {
        return renderTag(candidateName[0]);
      }
      // 多个办理人
      const names = candidateName.join(',');
      const currentName = candidateName[candidateName.length - 1];
      return (
        <Tooltip placement="top" title={names}>
          {renderTag(currentName)}
        </Tooltip>
      );
    },
  },
  {
    dataIndex: 'businessStatus',
    title: '流程状态',
    customRender({ value }) {
      return renderDict(value, DictEnum.WF_BUSINESS_STATUS);
    },
  },
  {
    dataIndex: 'createTime',
    title: '创建时间',
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
