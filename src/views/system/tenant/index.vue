<template>
  <PageWrapper dense>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          class="<sm:hidden"
          v-auth="'system:tenant:export'"
          @click="downloadExcel(tenantExport, '租户信息', getForm().getFieldsValue())"
          >导出</a-button
        >
        <a-button
          class="<sm:hidden"
          type="primary"
          danger
          v-auth="'system:tenant:remove'"
          :disabled="!selected"
          @click="multipleRemove(tenantRemove)"
          >删除</a-button
        >
        <a-button type="primary" @click="handleAdd" v-auth="'system:tenant:add'">新增</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <TableSwitch
            v-model="record.status"
            :disabled="record.id === 1 || !hasPermission('system:tenant:edit')"
            :api="() => tenantStatusChange(record)"
            :reload="reload"
          />
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '修改',
                icon: IconEnum.EDIT,
                type: 'primary',
                ghost: true,
                auth: 'system:tenant:edit ',
                onClick: handleEdit.bind(null, record),
                ifShow: record.id !== 1,
              },
              {
                label: '同步',
                icon: IconEnum.SYNC,
                type: 'primary',
                color: 'success',
                ghost: true,
                auth: 'system:tenant:edit ',
                popConfirm: {
                  title: `是否同步[${record.companyName}]的套餐?`,
                  placement: 'left',
                  confirm: handleSync.bind(null, record),
                },
                ifShow: record.id !== 1,
              },
              {
                label: '删除',
                icon: IconEnum.DELETE,
                type: 'primary',
                danger: true,
                ghost: true,
                auth: 'system:tenant:delete',
                ifShow: record.id !== 1,
                popConfirm: {
                  title: `是否删除租户[${record.companyName} - ID: ${record.tenantId}]?`,
                  placement: 'left',
                  confirm: handleRemove.bind(null, record),
                },
              },
            ]"
        /></template>
      </template>
    </BasicTable>
    <TenantDrawer @register="registerDrawer" @reload="reload" />
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '@/components/Page';
  import {
    tenantList,
    tenantRemove,
    tenantSyncPackage,
    tenantStatusChange,
    tenantExport,
  } from '@/api/system/tenant';
  import { BasicTable, useTable, TableAction, TableSwitch } from '@/components/Table';
  import { columns, formSchemas } from './tenant.data';
  import { IconEnum } from '@/enums/appEnum';
  import { useMessage } from '@/hooks/web/useMessage';
  import { downloadExcel } from '@/utils/file/download';
  import TenantDrawer from './TenantDrawer.vue';
  import { useDrawer } from '@/components/Drawer';
  import { useTenantStore } from '@/store/modules/tenant';
  import { packageSelectList } from '@/api/system/tenantPackage';
  import { usePermission } from '@/hooks/web/usePermission';

  defineOptions({ name: 'Tenant' });

  const { hasPermission } = usePermission();

  const [registerTable, { reload, selected, multipleRemove, getForm }] = useTable({
    rowSelection: {
      type: 'checkbox',
      getCheckboxProps: (record: Recordable) => ({
        disabled: record.id === 1,
      }),
    },
    title: '租户列表',
    rowKey: 'id',
    showIndexColumn: false,
    useSearchForm: true,
    formConfig: {
      schemas: formSchemas,
      baseColProps: {
        xs: 24,
        sm: 24,
        md: 24,
        lg: 6,
      },
      name: 'tenant',
      labelWidth: 100,
      // 日期选择格式化
      fieldMapToTime: [
        [
          'createTime',
          ['params[beginTime]', 'params[endTime]'],
          ['YYYY-MM-DD 00:00:00', 'YYYY-MM-DD 23:59:59'],
        ],
      ],
    },
    columns,
    api: tenantList,
    actionColumn: {
      width: 260,
      fixed: 'right',
      title: '操作',
      key: 'action',
    },
  });

  const [registerDrawer, { openDrawer }] = useDrawer();
  const { createMessage } = useMessage();

  async function handleAdd() {
    // 检测是否创建过了租户套餐
    const tenantPackageList = await packageSelectList();
    /**
     * packages为空 提示
     */
    if (!tenantPackageList.length) {
      // todo 跳转到租户套餐
      createMessage.warning('请先创建租户套餐后重试');
      return;
    }
    openDrawer(true, { update: false, tenantPackageList });
  }

  async function handleEdit(record: Recordable) {
    const tenantPackageList = await packageSelectList();
    openDrawer(true, { update: true, record, tenantPackageList });
  }

  async function handleSync(record: Recordable) {
    const { tenantId, packageId = '0' } = record;
    await tenantSyncPackage(tenantId, packageId);
    await reload();
  }

  const { initTenant } = useTenantStore();
  async function handleRemove(record: Recordable) {
    await tenantRemove([record.id]);
    await reload();
    // store重新获取租户信息
    await initTenant();
  }
</script>
<style scoped></style>
