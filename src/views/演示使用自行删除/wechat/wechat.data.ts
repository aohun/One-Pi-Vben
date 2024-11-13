import { BasicColumn } from '@/components/Table';
import { useRender } from '@/hooks/component/useRender';
import { DictEnum } from '@/enums/dictEnum';

const { renderDict } = useRender();
export const columns: BasicColumn[] = [
  {
    title: 'id',
    dataIndex: 'id',
  },
  {
    title: '状态',
    dataIndex: 'status',
    customRender({ value }) {
      return renderDict(value, DictEnum.NORMAL_DISABLE);
    },
  },
  {
    title: '预览',
    dataIndex: 'groupImg',
  },
  {
    title: '上传时间',
    dataIndex: 'createTime',
  },
];
