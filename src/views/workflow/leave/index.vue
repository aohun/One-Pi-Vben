<template>
  <PageWrapper dense>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          class="<sm:hidden"
          @click="downloadExcel(exportExcel, '请假信息', getForm().getFieldsValue())"
          v-auth="'workflow:leave:export'"
          >导出</a-button
        >
        <a-button
          class="<sm:hidden"
          type="primary"
          danger
          @click="multipleRemove(removeByIds)"
          :disabled="!selected"
          v-auth="'workflow:leave:remove'"
          >删除</a-button
        >
        <a-button type="primary" @click="handleAdd" v-auth="'workflow:leave:add'">新增</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column && record && column.key === 'action'">
          <!-- 完成/撤销不显示 -->
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                label: '修改',
                icon: IconEnum.EDIT,
                auth: 'workflow:leave:edit',
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
                auth: 'workflow:leave:list',
                onClick: handleToApproveRecord.bind(null, record),
                ifShow: record.status !== 'draft' && record.status !== 'cancel',
              },
              {
                label: '撤销',
                icon: IconEnum.EDIT,
                danger: true,
                auth: 'workflow:leave:edit',
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
                auth: 'workflow:leave:remove',
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
  import { list, exportExcel, removeByIds } from './api';
  import { downloadExcel } from '@/utils/file/download';
  import { formSchemas, columns } from './leave.data';
  import { IconEnum } from '@/enums/appEnum';
  import { useGo } from '@/hooks/web/usePage';
  import { cancelProcessApply } from '@/api/workflow/processInstance';
  import { PageEnum } from '@/enums/pageEnum';
  import { onBeforeMount, onActivated } from 'vue';

  defineOptions({ name: 'Leave' });

  const [registerTable, { reload, multipleRemove, selected, getForm }] = useTable({
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
    title: '请假列表',
    titleHelpMessage: [
      '先到流程定义部署 [后端根目录/script/bpmn/模型.zip] 后再使用!',
      '切换不同类型的流程(会签/普通)等, 到[流程定义-绑定业务]设置表名为[test_leave]',
    ],
    api: list,
    showIndexColumn: false,
    rowKey: 'id',
    useSearchForm: true,
    formConfig: {
      schemas: formSchemas,
      name: 'leave',
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

  function handleEdit(record: Recordable) {
    go({ path: '/workflow/leaveEdit/index' as PageEnum, query: { id: record.id, type: 'update' } });
  }

  function handleAdd() {
    go({ path: '/workflow/leaveEdit/index' as PageEnum, query: { type: 'add' } });
  }

  async function handleDelete(record: Recordable) {
    await removeByIds([record.id]);
    await reload();
  }

  // 前往审批记录页面
  const go = useGo();
  function handleToApproveRecord(record: Recordable) {
    // 前往审批记录页面
    const id = record.id;
    go({ path: '/workflow/leaveEdit/index' as PageEnum, query: { id, type: 'preview' } });
  }

  // 撤销
  async function handleRevoke(record: Recordable) {
    await cancelProcessApply(record.id);
    await reload();
  }
  onActivated(() => {
    reload();
  });
</script>

<style scoped></style>
