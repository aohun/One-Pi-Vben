import { useDescription } from '@/components/Description';
import Description from '@/components/Description/src/Description.vue';
import { useTable } from '@/components/Table';
import BasicTable from '@/components/Table/src/BasicTable.vue';
import { defineComponent, onMounted } from 'vue';

export default defineComponent({
  name: 'Preview',
  props: {
    data: {
      type: Object as PropType<{ name: string; notes: string }>,
      required: true,
    },
    records: {
      type: Array as PropType<{ name: string; price: number; num: number; total: number }[]>,
      required: true,
    },
  },
  setup(props) {
    const [registerDescription, { setDescProps }] = useDescription({
      column: 1,
      schema: [
        {
          field: 'name',
          label: '名称',
        },
        {
          field: 'notes',
          label: '备注',
        },
      ],
    });

    const [registerTable, { setTableData }] = useTable({
      columns: [
        {
          title: '名称',
          dataIndex: 'name',
        },
        {
          title: '数量',
          dataIndex: 'num',
        },
        {
          title: '单价',
          dataIndex: 'price',
        },
        {
          title: '总价',
          dataIndex: 'total',
        },
      ],
      pagination: false,
      showTableSetting: false,
      canResize: false,
    });

    onMounted(() => {
      setDescProps({ data: props.data });
      setTableData(props.records);
    });

    return () => (
      <>
        <Description onRegister={registerDescription}></Description>
        <BasicTable onRegister={registerTable}></BasicTable>
      </>
    );
  },
});
