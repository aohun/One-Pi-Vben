<template>
  <PageWrapper dense>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button @click="downloadExcel(demoExport, '测试单数据')" v-auth="'demo:demo:export'"
          >数据</a-button
        >
        <a-button
          type="error"
          @click="multipleRemove(demoRemove)"
          :disabled="!selected"
          v-auth="'demo:demo:remove'"
          >删除</a-button
        >
        <a-button type="primary" @click="handleAdd" v-auth="'demo:demo:add'">新增</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                label: '修改',
                icon: IconEnum.EDIT,
                type: 'primary',
                ghost: true,
                auth: 'demo:demo:edit',
                onClick: handleEdit.bind(null, record),
              },
              {
                label: '删除',
                icon: IconEnum.DELETE,
                type: 'primary',
                danger: true,
                ghost: true,
                auth: 'demo:demo:remove',
                popConfirm: {
                  placement: 'left',
                  title: '是否删除测试单[' + record.id + ']?',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <DemoModal @register="registerModal" @reload="reload" />
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '@/components/Page';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { demoList, demoExport, demoRemove } from './api';
  import { downloadExcel } from '@/utils/file/download';
  import { useModal } from '@/components/Modal';
  import DemoModal from './DemoModal.vue';
  import { formSchems, columns } from './demo.data';
  import { IconEnum } from '@/enums/appEnum';

  defineOptions({ name: 'Demo' });

  const [registerTable, { reload, multipleRemove, selected }] = useTable({
    rowSelection: {
      type: 'checkbox',
    },
    title: '测试单列表',
    api: demoList,
    showIndexColumn: false,
    rowKey: 'id',
    useSearchForm: true,
    formConfig: {
      schemas: formSchems,
      baseColProps: {
        span: 8,
      },
    },
    columns: columns,
    actionColumn: {
      width: 200,
      title: '操作',
      key: 'action',
      fixed: 'right',
    },
  });

  const [registerModal, { openModal }] = useModal();

  function handleEdit(record: Recordable) {
    openModal(true, { record, update: true });
  }

  function handleAdd() {
    openModal(true, { update: false });
  }

  async function handleDelete(record: Recordable) {
    await demoRemove([record.id]);
    await reload();
  }
</script>

<style scoped></style>
