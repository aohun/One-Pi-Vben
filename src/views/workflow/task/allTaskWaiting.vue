<template>
  <PageWrapper dense>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" :disabled="!selected" @click="openEditModal">修改办理人</a-button>
        <RadioGroup button-style="solid" v-model:value="currentState" @change="handleStateChange">
          <RadioButton value="waiting">运行中</RadioButton>
          <RadioButton value="finished">已完成</RadioButton>
        </RadioGroup>
      </template>
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
              {
                label: '流程变量',
                icon: 'carbon:parameter',
                onClick: handleProcessVariable.bind(null, record),
                ifShow: currentState === 'waiting',
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <UserSelectModal @register="registerModal" @single-done="handleEdit" />
    <ProcessVariableDrawer @register="registerDrawer" />
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '@/components/Page';
  import { RadioGroup, RadioButton } from 'ant-design-vue';
  import { ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { columns, schemas } from '@/views/workflow/task/allTaskWaiting/data';
  import { IconEnum } from '@/enums/appEnum';
  import {
    getPageByAllTaskWait,
    getPageByAllTaskFinish,
    updateAssignee,
  } from '@/api/workflow/task';
  import { useGo } from '@/hooks/web/usePage';
  import UserSelectModal from '@/views/workflow/components/UserSelectModal/index.vue';
  import { useModal } from '@/components/Modal';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useDrawer } from '@/components/Drawer';
  import ProcessVariableDrawer from './allTaskWaiting/ProcessVariableDrawer.vue';
  import { User } from '@/api/system/user/model';

  // 缓存
  defineOptions({ name: 'AllTaskWaiting' });

  /**
   * 状态切换重新加载表格
   */
  type InstanceState = 'waiting' | 'finished';
  const currentState = ref<InstanceState>('waiting');
  async function handleStateChange() {
    const currentApi =
      currentState.value === 'waiting' ? getPageByAllTaskWait : getPageByAllTaskFinish;
    setProps({ api: currentApi });
    await reload();
  }

  const [registerTable, { setProps, reload, selected, getSelectRowKeys, setSelectedRowKeys }] =
    useTable({
      rowSelection: {
        type: 'checkbox',
      },
      title: '所有待办任务列表',
      showIndexColumn: false,
      api: getPageByAllTaskWait,
      rowKey: 'id',
      useSearchForm: true,
      formConfig: {
        schemas: schemas,
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
        width: 220,
        title: '操作',
        key: 'action',
        fixed: 'right',
      },
    });

  const [registerModal, { openModal }] = useModal();
  function openEditModal() {
    openModal(true, { type: 'single' });
  }

  const { createMessage } = useMessage();
  /**
   * 这里的回调才是真正的修改办理人
   */
  async function handleEdit(list: User[]) {
    console.log(list);
    const ids = getSelectRowKeys() as string[];
    if (ids.length === 0 || list.length === 0) {
      createMessage.warn('未选中, 无法处理');
      return;
    }
    // 取第一个 todo 后续要改这里的逻辑
    const userId = list[0].userId;
    await updateAssignee(ids, userId);
    await reload();
    setSelectedRowKeys([]);
  }

  const go = useGo();
  function handleToApproveRecord(record: Recordable) {
    // 前往审批记录页面
    const url = record.wfNodeConfigVo.wfFormManageVo.router;
    go({ path: url, query: { id: record.businessKey, type: 'preview' } });
  }

  const [registerDrawer, { openDrawer }] = useDrawer();
  function handleProcessVariable(record: Recordable) {
    openDrawer(true, record.id);
  }
</script>

<style lang="less" scoped></style>
