import { useDescription } from '@/components/Description';
import Description from '@/components/Description/src/Description.vue';
import { defineComponent, onMounted } from 'vue';
import { leaveTypeOptions } from './leave.data';
import { dateUtil } from '@/utils/dateUtil';

export default defineComponent({
  name: 'Preview',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const [registerDescription, { setDescProps }] = useDescription({
      column: 1,
      schema: [
        {
          field: 'leaveType',
          label: '请假类型',
          render(value) {
            return leaveTypeOptions.find((item) => item.value == value)?.label || '未知';
          },
        },
        {
          field: 'startDate',
          label: '请假时间',
          render(_, data) {
            const startDate = dateUtil(data.startDate).format('YYYY-MM-DD');
            const endDate = dateUtil(data.endDate).format('YYYY-MM-DD');
            return <>{`${startDate} 至 ${endDate}`}</>;
          },
        },
        {
          field: 'leaveDays',
          label: '请假天数',
          render(value) {
            return `${value} 天`;
          },
        },
        {
          field: 'remark',
          label: '请假原因',
          render(value) {
            return value || '无';
          },
        },
      ],
    });

    onMounted(() => setDescProps({ data: props.data }));

    return () => (
      <>
        <Description onRegister={registerDescription}></Description>
      </>
    );
  },
});
