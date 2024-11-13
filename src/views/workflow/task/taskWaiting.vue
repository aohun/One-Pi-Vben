<template>
  <PageWrapper dense>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column && record && column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                label: '办理',
                icon: IconEnum.EDIT,
                onClick: handleExecute.bind(null, record),
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
  import { schemas, columns } from '@/views/workflow/task/taskWaiting/data';
  import { getPageByTaskWait } from '@/api/workflow/task';
  import { IconEnum } from '@/enums/appEnum';
  import { useGo } from '@/hooks/web/usePage';

  const [registerTable] = useTable({
    rowSelection: {
      type: 'checkbox',
    },
    title: '我的待办列表',
    showIndexColumn: false,
    api: getPageByTaskWait,
    rowKey: 'id',
    useSearchForm: true,
    formConfig: {
      schemas: schemas,
      name: 'taskWaiting',
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
      width: 120,
      title: '操作',
      key: 'action',
      fixed: 'right',
    },
  });

  // 认领
  // async function handleClaim(record: Recordable) {
  //   await claim(record.id);
  //   await reload();
  // }

  // async function handleRevert(record: Recordable) {
  //   await returnTask(record.id);
  //   await reload();
  // }

  // 办理 todo
  /**
   *
   * http://localhost:81/prod-api/workflow/task/completeTask
   * post
   * @param record {
   * "taskId":"1765392187713081349",
   * "message":"同意办理","variables":{},
   * "messageType":["1","2","3"],
   * "wfCopyList":[],
   * "taskVariables":{}}
   */
  const go = useGo();
  function handleExecute(record: Recordable) {
    // 各种的id能把人绕晕--!
    const url = record.wfNodeConfigVo.wfFormManageVo.router;
    const taskId = record.id;
    go({ path: url, query: { id: record.businessKey, type: 'approval', taskId } });
  }
</script>

<style scoped></style>
