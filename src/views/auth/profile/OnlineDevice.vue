<template>
  <div>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <TableAction
            :actions="[
              {
                label: '强制退出',
                danger: true,
                type: 'primary',
                ghost: true,
                icon: 'ic:outline-logout',
                popConfirm: {
                  title: '确认强制退出吗？',
                  placement: 'left',
                  confirm: handleForceLogout.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
  </div>
</template>

<script setup lang="ts">
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { onlineDeviceList, forceLogout2 } from '@/api/monitor/online';
  import { useRender } from '@/hooks/component/useRender';
  import { dateUtil } from '@/utils/dateUtil';
  import { useMessage } from '@/hooks/web/useMessage';

  const { renderBrowserIcon, renderOsIcon } = useRender();

  const [registerTable, { reload }] = useTable({
    title: '在线设备',
    rowKey: 'tokenId',
    api: onlineDeviceList,
    pagination: false,
    columns: [
      {
        title: '设备类型',
        dataIndex: 'deviceType',
      },
      {
        title: 'IP地址',
        dataIndex: 'ipaddr',
      },
      {
        title: 'IP信息',
        dataIndex: 'loginLocation',
      },
      {
        title: '系统',
        dataIndex: 'os',
        customRender({ value }) {
          if (value) {
            const split = value.split(' or ');
            if (split.length === 2) {
              value = split[0];
            }
          }
          return renderOsIcon(value, true);
        },
      },
      {
        title: '浏览器',
        dataIndex: 'browser',
        customRender({ value }) {
          return renderBrowserIcon(value, true);
        },
      },
      {
        title: '登录时间',
        dataIndex: 'loginTime',
        customRender({ value }) {
          return dateUtil(value).format('YYYY-MM-DD HH:mm:ss');
        },
      },
    ],
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
    },
  });

  const { createMessage } = useMessage();
  async function handleForceLogout(record: Recordable) {
    await forceLogout2(record.tokenId);
    await reload();
    createMessage.success(`退出用户账号[${record.userName}]成功`);
  }
</script>

<style scoped></style>
