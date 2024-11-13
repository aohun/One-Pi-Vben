import { BasicModal, useModalInner } from '@/components/Modal';
import { defineComponent } from 'vue';
import { getListByDeleteMultiInstance } from '@/api/workflow/task';
import { useTable, BasicTable } from '@/components/Table';
import type { DeleteMultiInstanceVo } from '@/api/workflow/task/model';

export default defineComponent({
  name: 'DeleteMultiInstanceModal',
  emits: ['selectDone', 'register'],
  setup(_, { attrs, emit }) {
    const [registerModalInner, { modalLoading, closeModal }] = useModalInner(openModalCallback);
    async function openModalCallback(taskId: string) {
      modalLoading(true);

      const resp = await getListByDeleteMultiInstance(taskId);
      setTableData(resp);

      modalLoading(false);
    }

    const [registerTable, { setTableData, getSelectRows, setSelectedRowKeys }] = useTable({
      showIndexColumn: true,
      showTableSetting: false,
      pagination: false,
      size: 'small',
      canResize: false,
      rowKey: 'assignee',
      clickToRowSelect: true,
      columns: [
        {
          title: '任务名称',
          dataIndex: 'name',
        },
        {
          title: '办理人',
          dataIndex: 'assigneeName',
        },
      ],
      rowSelection: {
        type: 'checkbox',
      },
    });

    async function handleSubmit() {
      try {
        modalLoading(true);
        const selectList = getSelectRows() as DeleteMultiInstanceVo[];
        console.log(selectList);
        if (!selectList.length) {
          return;
        }
        handleCancel();
        emit('selectDone', selectList);
      } catch (e) {
        console.warn(e);
      } finally {
        modalLoading(false);
      }
    }

    async function handleCancel() {
      closeModal();
      setSelectedRowKeys([]);
    }

    return () => (
      <BasicModal
        {...attrs}
        title="减签人员"
        width={600}
        onRegister={registerModalInner}
        onOk={handleSubmit}
        onCancel={handleCancel}
      >
        <BasicTable onRegister={registerTable}></BasicTable>
      </BasicModal>
    );
  },
});
