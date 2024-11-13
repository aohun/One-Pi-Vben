import { BasicColumn } from '@/components/Table';
import { eventSelectOptions, typeSelectOptions } from './listener.data';

export const columns: BasicColumn[] = [
  {
    dataIndex: 'event',
    title: '事件',
    width: 80,
    customRender({ value }) {
      const current = eventSelectOptions.find((item) => item.value === value);
      if (current) {
        return current.label;
      }
      return value;
    },
  },
  {
    dataIndex: 'type',
    title: '类型',
    width: 100,
    customRender({ value }) {
      const current = typeSelectOptions.find((item) => item.value === value);
      if (current) {
        return current.label;
      }
      return value;
    },
  },
  {
    dataIndex: 'className',
    ifShow: false,
    title: '表达式',
    width: 120,
  },
];
