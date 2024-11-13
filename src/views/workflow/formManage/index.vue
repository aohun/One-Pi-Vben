<template>
  <PageWrapper dense>
  <!-- 页面包裹层 （紧凑布局）-->
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          @click="downloadExcel(wfFormManageExport, '表单数据')"
          v-auth="'system:formManage:export'"
          >导出</a-button
        >
        <a-button
          type="primary"
          danger
          @click="multipleRemove(wfFormManageRemove)"
          :disabled="!selected"
          v-auth="'system:formManage:remove'"
          >删除</a-button
        >
        <a-button type="primary" @click="handleAdd" v-auth="'system:formManage:add'">新增</a-button>
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
                auth: 'system:formManage:edit',
                onClick: handleEdit.bind(null, record),
              },
              {
                label: '删除',
                icon: IconEnum.DELETE,
                type: 'primary',
                danger: true,
                ghost: true,
                auth: 'system:formManage:remove',
                popConfirm: {
                  placement: 'left',
                  title: '是否删除表单[' + record.id + ']?',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <FormManageModal @register="registerModal" @reload="reload" />
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '@/components/Page';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import {
    wfFormManageList,
    wfFormManageExport,
    wfFormManageRemove,
  } from '@/api/workflow/formManage';
  import { downloadExcel } from '@/utils/file/download';
  import { useModal } from '@/components/Modal';
  import FormManageModal from './FormManageModal.vue';
  import { formSchemas, columns } from './formManage.data';
  import { IconEnum } from '@/enums/appEnum';

  defineOptions({ name: 'FormManage' });

  const [registerTable, { reload, multipleRemove, selected }] = useTable({
    rowSelection: {
      type: 'checkbox',
    },
    title: '表单列表',
    api: wfFormManageList,
    showIndexColumn: false,
    rowKey: 'id',
    useSearchForm: true,
    formConfig: {
      schemas: formSchemas,
      baseColProps: {
        xs: 24,
        sm: 24,
        md: 24,
        lg: 6,
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
    await wfFormManageRemove([record.id]);
    await reload();
  }
</script>

<style scoped></style>
