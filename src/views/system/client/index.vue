<template>
  <PageWrapper dense>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <Space>
          <a-button
            class="<sm:hidden"
            v-auth="'system:user:export'"
            @click="downloadExcel(clientExport, '客户端信息', getForm().getFieldsValue())"
            >导出</a-button
          >
          <a-button
            v-auth="'system:client:remove'"
            class="<sm:hidden"
            type="primary"
            danger
            :disabled="!selected"
            @click="multipleRemove(clientExport)"
            >删除</a-button
          >
          <a-button type="primary" @click="handleAdd" v-auth="'system:client:add'">新增</a-button>
        </Space>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'status'">
          <!-- pc不允许禁用 禁用了直接登录不了 应该设置disabled -->
          <!-- 登录提示: 认证权限类型已禁用 -->
          <TableSwitch
            v-model="record.status"
            :disabled="record.id === 1 || !hasPermission('system:client:edit')"
            :api="() => clientChangeStatus(record)"
            :reload="reload"
          />
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                label: '修改',
                icon: IconEnum.EDIT,
                type: 'primary',
                ghost: true,
                auth: 'system:client:edit',
                onClick: handleEdit.bind(null, record),
              },
              {
                label: '删除',
                icon: IconEnum.DELETE,
                type: 'primary',
                danger: true,
                ghost: true,
                auth: 'system:client:remove',
                popConfirm: {
                  placement: 'left',
                  title: `是否删除客户端[${record.clientKey}]?`,
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <ClientDrawer @register="registerDrawer" @reload="reload" />
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '@/components/Page';
  import { BasicTable, useTable, TableAction, TableSwitch } from '@/components/Table';
  import { Space } from 'ant-design-vue';
  import { clientList, clientExport, clientRemove, clientChangeStatus } from '@/api/system/client';
  import { downloadExcel } from '@/utils/file/download';
  import { formSchemas, columns } from './client.data';
  import { IconEnum } from '@/enums/appEnum';
  import ClientDrawer from './ClientDrawer.vue';
  import { useDrawer } from '@/components/Drawer';
  import { usePermission } from '@/hooks/web/usePermission';

  defineOptions({ name: 'Client' });
  const { hasPermission } = usePermission();

  const [registerTable, { reload, multipleRemove, selected, getForm }] = useTable({
    rowSelection: {
      type: 'checkbox',
    },
    api: clientList,
    title: '客户端列表',
    showIndexColumn: false,
    rowKey: 'id',
    useSearchForm: true,
    formConfig: {
      schemas: formSchemas,
      name: 'client',
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

  const [registerDrawer, { openDrawer }] = useDrawer();

  function handleEdit(record: Recordable) {
    openDrawer(true, { record, update: true });
  }

  function handleAdd() {
    openDrawer(true, { update: false });
  }

  async function handleDelete(record: Recordable) {
    await clientRemove([record.id]);
    await reload();
  }
</script>

<style scoped></style>
