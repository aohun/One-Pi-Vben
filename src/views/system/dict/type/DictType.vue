<template>
  <div>
    <BasicTable @register="tableRegister" @row-click="handleRowClick">
      <template #toolbar>
        <Space>
          <Dropdown>
            <template #overlay>
              <Menu @click="handleMenuClick">
                <MenuItem key="1">刷新字典缓存</MenuItem>
                <MenuItem v-if="isSuperAdmin" key="2">同步租户字典</MenuItem>
              </Menu>
            </template>
            <a-button> 更多 </a-button>
          </Dropdown>
          <a-button
            class="<sm:hidden"
            v-auth="'system:dict:export'"
            @click="downloadExcel(dictExport, '字典信息', getForm().getFieldsValue())"
            >导出</a-button
          >
          <a-button
            class="<sm:hidden"
            type="primary"
            danger
            :disabled="!selected"
            v-auth="'system:dict:remove'"
            @click="multipleRemove(dictTypeRemove)"
          >
            删除
          </a-button>
          <a-button type="primary" @click="handleAdd" v-auth="'system:dict:add'"> 新增 </a-button>
        </Space>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :stopButtonPropagation="true"
            :actions="[
              {
                label: '编辑',
                type: 'primary',
                icon: IconEnum.EDIT,
                ghost: true,
                auth: 'system:dict:edit',
                onClick: handleEdit.bind(null, record),
              },
              {
                label: '删除',
                type: 'primary',
                danger: true,
                icon: IconEnum.DELETE,
                ghost: true,
                auth: 'system:dict:remove',
                popConfirm: {
                  title: `是否删除[${record.dictName}]`,
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <DictTypeModal @register="registerModal" @reload="reload" />
  </div>
</template>

<script setup lang="ts">
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import {
    dictExport,
    dictList,
    dictTypeRemove,
    refreshDictTypeCache,
  } from '@/api/system/dict/dictType';
  import { Space, Dropdown, Menu, MenuItem, MenuProps } from 'ant-design-vue';
  import { useModal } from '@/components/Modal';
  import { downloadExcel } from '@/utils/file/download';
  import DictTypeModal from './DictTypeModal.vue';
  import { columns, formSchemas } from './dictType.data';
  import { IconEnum } from '@/enums/appEnum';
  import { useUserStore } from '@/store/modules/user';
  import { computed } from 'vue';
  import { dictSyncTenant } from '@/api/system/tenant';
  import { useMessage } from '@/hooks/web/useMessage';

  defineOptions({ name: 'DictType' });

  const emit = defineEmits<{
    getDictType: [dictType: string];
  }>();

  const [tableRegister, { reload, multipleRemove, selected, getForm }] = useTable({
    rowSelection: {
      type: 'checkbox',
    },
    title: '字典列表',
    rowKey: 'dictId',
    showIndexColumn: false,
    useSearchForm: true,
    formConfig: {
      schemas: formSchemas,
      labelWidth: 80,
      name: 'dict_type',
      baseColProps: {
        xs: 24,
        sm: 24,
        md: 24,
        lg: 8,
      },
    },
    columns,
    api: dictList,
    actionColumn: {
      width: 200,
      title: '操作',
      key: 'action',
    },
  });
  function handleRowClick(record: Recordable) {
    const { dictType } = record;
    emit('getDictType', dictType);
  }

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    switch (e.key) {
      case '1':
        handleRefreshCache();
        break;
      case '2':
        handleSyncTenantDict();
        break;
    }
  };
  async function handleRefreshCache() {
    await refreshDictTypeCache();
    await reload();
  }

  const userStore = useUserStore();
  const isSuperAdmin = computed(() => userStore.userInfo?.roles.includes('superadmin'));
  const { createConfirm } = useMessage();
  function handleSyncTenantDict() {
    createConfirm({
      title: '提示',
      iconType: 'warning',
      content: '确认同步租户字典？',
      onOk: async () => {
        await dictSyncTenant();
        await reload();
      },
    });
  }

  const [registerModal, { openModal }] = useModal();

  function handleAdd() {
    openModal(true, { update: false });
  }

  function handleEdit(record: Recordable) {
    openModal(true, { update: true, record });
  }

  async function handleDelete(record: Recordable) {
    await dictTypeRemove([record.dictId]);
    await reload();
  }
</script>

<style scoped></style>
