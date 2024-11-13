<template>
  <PageWrapper title="子表单流程测试" content="非官方功能" dense>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          @click="downloadExcel(purchaseExport, '采购申请数据')"
          v-auth="'demo:purchase:export'"
          >导出</a-button
        >
        <a-button
          type="primary"
          danger
          @click="multipleRemove(purchaseRemove)"
          :disabled="!selected"
          v-auth="'demo:purchase:remove'"
          >删除</a-button
        >
        <a-button type="primary" @click="handleAdd" v-auth="'demo:purchase:add'">新增</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <!-- 完成/撤销不显示 -->
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                label: '修改',
                icon: IconEnum.EDIT,
                auth: 'demo:leave:edit',
                onClick: handleEdit.bind(null, record),
                ifShow:
                  record.status !== 'invalid' &&
                  record.status !== 'finish' &&
                  record.status !== 'waiting' &&
                  record.status !== 'termination',
              },
              {
                label: '记录',
                icon: IconEnum.PREVIEW,
                auth: 'demo:leave:list',
                onClick: handleToApproveRecord.bind(null, record),
                ifShow: record.status !== 'draft' && record.status !== 'cancel',
              },
              {
                label: '撤销',
                icon: IconEnum.EDIT,
                danger: true,
                auth: 'demo:leave:edit',
                ifShow: record.status === 'waiting',
                popConfirm: {
                  placement: 'left',
                  title: `是否撤销当前申请?`,
                  confirm: handleRevoke.bind(null, record),
                },
              },
              {
                label: '删除',
                icon: IconEnum.DELETE,
                danger: true,
                auth: 'demo:leave:remove',
                ifShow:
                  record.status !== 'invalid' &&
                  record.status !== 'finish' &&
                  record.status !== 'waiting' &&
                  record.status !== 'termination',
                popConfirm: {
                  placement: 'left',
                  title: `是否删除请假[${record.id}]?`,
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '@/components/Page';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { purchaseList, purchaseExport, purchaseRemove } from './api';
  import { downloadExcel } from '@/utils/file/download';
  import { formSchemas, columns } from './purchase.data';
  import { IconEnum } from '@/enums/appEnum';
  import { useGo } from '@/hooks/web/usePage';
  import { PageEnum } from '@/enums/pageEnum';
  import { cancelProcessApply } from '@/api/workflow/processInstance';

  defineOptions({ name: 'Purchase' });

  const [registerTable, { reload, multipleRemove, selected }] = useTable({
    rowSelection: {
      type: 'checkbox',
      getCheckboxProps: (record: Recordable) => ({
        // 撤销/草稿 可删除
        disabled:
          record.status === 'invalid' ||
          record.status === 'finish' ||
          record.status === 'waiting' ||
          record.status === 'termination',
      }),
    },
    title: '采购申请列表',
    api: purchaseList,
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

  const go = useGo();
  function handleEdit(record: Recordable) {
    go({ path: '/demo/purchaseEdit/index' as PageEnum, query: { id: record.id, type: 'update' } });
  }

  function handleAdd() {
    go({ path: '/demo/purchaseEdit/index' as PageEnum, query: { type: 'add' } });
  }

  async function handleDelete(record: Recordable) {
    await purchaseRemove([record.id]);
    await reload();
  }

  // 前往审批记录页面
  function handleToApproveRecord(record: Recordable) {
    // 前往审批记录页面
    const id = record.id;
    go({ path: '/demo/purchaseEdit/index' as PageEnum, query: { id, type: 'preview' } });
  }

  // 撤销
  async function handleRevoke(record: Recordable) {
    await cancelProcessApply(record.id);
    await reload();
  }
</script>

<style scoped></style>
