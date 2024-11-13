<template>
  <PageWrapper dense>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button class="font-bold" type="link" @click="howToUse">oss文档</a-button>
        <a-button
          type="primary"
          danger
          @click="multipleRemove(ossConfigRemove)"
          :disabled="!selected"
          v-auth="'system:ossConfig:remove'"
          >删除</a-button
        >
        <a-button type="primary" @click="handleAdd" v-auth="'system:ossConfig:add'">新增</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'status'">
          <TableSwitch
            v-model="record.status"
            :disabled="!hasPermission('system:ossConfig:edit')"
            :api="() => ossConfigChangeStatus(record)"
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
                auth: 'system:ossConfig:edit',
                onClick: handleEdit.bind(null, record),
              },
              {
                label: '删除',
                icon: IconEnum.DELETE,
                type: 'primary',
                danger: true,
                ghost: true,
                auth: 'system:ossConfig:remove',
                popConfirm: {
                  placement: 'left',
                  title: `是否删除oss配置[${record.configKey}]?`,
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <OssConfigDrawer @register="registerDrawer" @reload="reload" />
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '@/components/Page';
  import { BasicTable, useTable, TableAction, TableSwitch } from '@/components/Table';
  import { ossConfigList, ossConfigRemove, ossConfigChangeStatus } from '@/api/system/oss/config';
  import { formSchemas, columns } from './oss.config.data';
  import { IconEnum } from '@/enums/appEnum';
  import { useDrawer } from '@/components/Drawer';
  import OssConfigDrawer from './OssConfigDrawer.vue';
  import { usePermission } from '@/hooks/web/usePermission';

  defineOptions({ name: 'OssConfig' });

  const { hasPermission } = usePermission();

  const [registerTable, { reload, multipleRemove, selected }] = useTable({
    rowSelection: {
      type: 'checkbox',
    },
    title: 'oss配置列表',
    showIndexColumn: false,
    api: ossConfigList,
    rowKey: 'ossConfigId',
    useSearchForm: true,
    beforeFetch: (params: Recordable) => {
      if (params.status) {
        params.status = params.status === 'Y' ? 0 : 1;
      }
      return params;
    },
    formConfig: {
      schemas: formSchemas,
      labelWidth: 80,
      name: 'oss_config',
      baseColProps: {
        xs: 24,
        sm: 24,
        md: 24,
        lg: 6,
      },
    },
    columns: columns,
    actionColumn: {
      width: 160,
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
    await ossConfigRemove([record.ossConfigId]);
    await reload();
  }

  function howToUse() {
    window.open('https://plus-doc.dromara.org/#/ruoyi-vue-plus/framework/basic/oss');
  }
</script>

<style scoped></style>
