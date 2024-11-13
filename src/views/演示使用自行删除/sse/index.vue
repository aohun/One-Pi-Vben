<template>
  <PageWrapper title="SSE测试" content="这这里可以进行[Server-sent events]测试 非官方功能">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          :pre-icon="IconEnum.ADD"
          type="primary"
          @click="handleSendMsg(0)"
          :disabled="!enable"
        >
          发送全体消息
        </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                label: '发送消息',
                icon: IconEnum.ADD,
                type: 'primary',
                ghost: true,
                disabled: !enable,
                onClick: handleSendMsg.bind(null, 1, record),
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <SendMsgModal @register="registerModal" @reload="reload" />
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '@/components/Page';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { sseList, sseStatus } from './api';
  import { onMounted, ref } from 'vue';
  import { IconEnum } from '@/enums/appEnum';
  import SendMsgModal from './SendMsgModal.vue';
  import { useModal } from '@/components/Modal';
  import { useMessage } from '@/hooks/web/useMessage';

  const [registerTable, { reload }] = useTable({
    showIndexColumn: true,
    api: sseList,
    title: '在线用户列表',
    rowKey: 'userId',
    columns: [
      {
        title: '用户ID',
        dataIndex: 'userId',
      },
      {
        title: '用户账号',
        dataIndex: 'userName',
      },
      {
        title: '用户昵称',
        dataIndex: 'nickName',
      },
      {
        title: '用户部门',
        dataIndex: 'deptName',
      },
    ],
    actionColumn: {
      width: 220,
      title: '操作',
      key: 'action',
      fixed: 'right',
    },
    pagination: false,
  });

  const [registerModal, { openModal }] = useModal();

  async function handleSendMsg(type: number, record?: Recordable) {
    const data = {
      type,
      nickname: record?.nickName,
      userId: record?.userId,
    };
    openModal(true, data);
  }

  const enable = ref<boolean>(true);
  const { createMessage } = useMessage();
  onMounted(async () => {
    const serverEnable = await sseStatus();
    enable.value = serverEnable;
    if (!enable.value) {
      createMessage.warn({ content: '未开启websocket功能' });
    }
  });
</script>

<style scoped></style>
