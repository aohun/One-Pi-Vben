import { BasicColumn } from '@/components/Table';
import { FormSchema } from '@/components/Form';
import { useRender } from '@/hooks/component/useRender';
import dayjs, { Dayjs } from 'dayjs';
import { dateUtil } from '@/utils/dateUtil';
// import { businessStatusOptions } from '@/views/workflow/common';
import { DictEnum } from '@/enums/dictEnum';

export const leaveTypeOptions = [
  {
    label: '事假',
    value: '1',
  },
  {
    label: '调休',
    value: '2',
  },
  {
    label: '病假',
    value: '3',
  },
  {
    label: '婚假',
    value: '4',
  },
  {
    label: '探亲假',
    value: '5',
  },
];

export const formSchemas: FormSchema[] = [
  {
    label: '请假天数',
    field: 'startLeaveDays',
    component: 'Input',
    componentProps: {
      placeholder: '输入天数',
    },
  },
  {
    label: '至',
    field: 'endLeaveDays',
    component: 'Input',
    componentProps: {
      placeholder: '输入天数',
    },
  },
];

const { renderTag, renderDict } = useRender();
export const columns: BasicColumn[] = [
  {
    title: '请假类型',
    dataIndex: 'leaveType',
    customRender({ value }) {
      const label = leaveTypeOptions.find((item) => item.value == value)?.label || '未知';
      return renderTag(label, 'blue');
    },
  },
  {
    title: '开始时间',
    dataIndex: 'startDate',
  },
  {
    title: '结束时间',
    dataIndex: 'startDate',
  },
  {
    title: '请假天数',
    dataIndex: 'leaveDays',
    customRender({ value }) {
      return renderTag(`${value}天`, 'green');
    },
  },
  {
    title: '请假原因',
    dataIndex: 'remark',
  },
  {
    title: '流程状态',
    dataIndex: 'status',
    customRender({ value }) {
      return renderDict(value, DictEnum.WF_BUSINESS_STATUS);
    },
  },
];

type DayJs = dayjs.Dayjs;
export const modalSchemas: FormSchema[] = [
  {
    label: 'id',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '请假类型',
    field: 'leaveType',
    component: 'Select',
    componentProps: {
      options: leaveTypeOptions,
      allowClear: false,
    },
    required: true,
  },
  {
    label: '请假时间',
    field: 'dateTime',
    component: 'RangePicker',
    required: true,
    componentProps({ formModel }) {
      return {
        // 当日期范围清空时
        onChange(date: [DayJs, DayJs] | [string, string] | null) {
          if (!date) {
            // 将leaveDays设置为undefined或null，表示没有选择日期范围
            formModel.leaveDays = undefined;
            return;
          }
          // 假设dateUtil是一个将日期字符串或DayJs对象转换为DayJs对象的函数
          // 这里我们假设传入的date已经是DayJs对象或可以被dateUtil转换为DayJs对象的字符串
          const start = typeof date[0] === 'string' ? dateUtil(date[0]) : date[0];
          const end = typeof date[1] === 'string' ? dateUtil(date[1]) : date[1];
          // 计算两个日期之间的天数差
          const diff = end.diff(start, 'day') + 1; // 加1是因为DayJs的diff不包含结束日期当天
          // 更新formModel中的leaveDays
          formModel.leaveDays = diff;
        },
        // 禁用早于当前日期
        disabledDate(current: Dayjs) {
          // 禁用早于当前日期
          return current.isBefore(dayjs(), 'day');
        },
      };
    },
  },
  {
    label: '请假天数',
    field: 'leaveDays',
    component: 'InputNumber',
    componentProps: {
      disabled: true,
      placeholder: '从日期选择器选择',
    },
  },
  {
    label: '请假原因',
    field: 'remark',
    component: 'InputTextArea',
    componentProps: {
      rows: 3,
    },
  },
];
