<template>
  <PageWrapper dense>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          class="<sm:hidden"
          v-auth="'system:tenantPackage:export'"
          @click="downloadExcel(packageExport, '租户套餐信息', getForm().getFieldsValue())"
          >导出</a-button
        >
        <a-button
          class="<sm:hidden"
          type="primary"
          danger
          @click="multipleRemove(packageRemove)"
          v-auth="'system:tenantPackage:remove'"
          :disabled="!selected"
          >删除</a-button
        >
        <a-button type="primary" @click="handleAdd" v-auth="'system:tenantPackage:add'"
          >新增</a-button
        >
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'status'">
          <TableSwitch
            v-model="record.status"
            :disabled="!hasPermission('system:tenantPackage:edit')"
            :api="() => packageChangeStatus(record)"
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
                auth: 'system:tenantPackage:edit ',
                onClick: handleEdit.bind(null, record),
              },
              {
                label: '删除',
                icon: IconEnum.DELETE,
                type: 'primary',
                danger: true,
                ghost: true,
                auth: 'system:tenantPackage:delete',
                popConfirm: {
                  placement: 'left',
                  title: `是否删除租户套餐[${record.packageName}]?`,
                  confirm: handleRemove.bind(null, record),
                },
              },
            ]"
        /></template>
      </template>
    </BasicTable>
    <TenantPackageDrawer @register="registerDrawer" @reload="reload" />
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '@/components/Page';
  import {
    packageList,
    packageRemove,
    packageExport,
    packageChangeStatus,
  } from '@/api/system/tenantPackage';
  import { BasicTable, useTable, TableAction, TableSwitch } from '@/components/Table';
  import { columns, formSchemas } from './tenantPackage.data';
  import { IconEnum } from '@/enums/appEnum';
  import { downloadExcel } from '@/utils/file/download';
  import TenantPackageDrawer from './TenantPackageDrawer.vue';
  import { useDrawer } from '@/components/Drawer';
  import { usePermission } from '@/hooks/web/usePermission';

  defineOptions({ name: 'TenantPackage' });

  const { hasPermission } = usePermission();

  const [registerTable, { reload, selected, multipleRemove, getForm }] = useTable({
    rowSelection: {
      type: 'checkbox',
    },
    title: '租户套餐列表',
    rowKey: 'packageId',
    showIndexColumn: false,
    useSearchForm: true,
    formConfig: {
      schemas: formSchemas,
      name: 'tenant_package',
      baseColProps: {
        xs: 24,
        sm: 24,
        md: 24,
        lg: 6,
      },
      fieldMapToTime: [
        [
          'createTime',
          ['params[beginTime]', 'params[endTime]'],
          ['YYYY-MM-DD 00:00:00', 'YYYY-MM-DD 23:59:59'],
        ],
      ],
    },
    columns,
    api: packageList,
    actionColumn: {
      width: 200,
      title: '操作',
      key: 'action',
    },
  });

  const [registerDrawer, { openDrawer }] = useDrawer();

  function handleAdd() {
    openDrawer(true, { update: false });
  }
  function handleEdit(record: Recordable) {
    openDrawer(true, { record, update: true });
  }

  async function handleRemove(record: Recordable) {
    await packageRemove([record.packageId]);
    await reload();
  }
</script>
<style scoped></style>
