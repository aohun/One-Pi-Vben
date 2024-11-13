<template>
  <PageWrapper dense>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column && record && column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                label: '审批记录',
                icon: IconEnum.PREVIEW,
                onClick: handleToApproveRecord.bind(null, record),
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
  import { schemas, columns } from '@/views/workflow/task/taskCopyList/data';
  import { getPageByTaskCopy } from '@/api/workflow/task';
  import { useGo } from '@/hooks/web/usePage';
  import { IconEnum } from '@/enums/appEnum';

  const [registerTable] = useTable({
    rowSelection: {
      type: 'checkbox',
    },
    title: '我的抄送列表',
    showIndexColumn: false,
    api: getPageByTaskCopy,
    rowKey: 'id',
    useSearchForm: true,
    formConfig: {
      schemas: schemas,
      name: 'taskCopyList',
      baseColProps: {
        xs: 24,
        sm: 24,
        md: 24,
        lg: 6,
      },
      labelWidth: 80,
    },
    columns,
    actionColumn: {
      width: 150,
      title: '操作',
      key: 'action',
      fixed: 'right',
    },
  });

  // 前往审批记录页面
  const go = useGo();
  function handleToApproveRecord(record: Recordable) {
    // 前往审批记录页面
    const url = record.wfNodeConfigVo.wfFormManageVo.router;
    go({ path: url, query: { id: record.businessKey, type: 'preview' } });
  }
</script>

<style scoped></style>
