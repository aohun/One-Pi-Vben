<template>
  <PageWrapper dense>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button @click="expandAll">展开</a-button>
        <a-button @click="collapseAll">折叠</a-button>
        <a-button type="primary" @click="handleAdd" v-auth="'demo:tree:add'">新增</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                label: '修改',
                icon: IconEnum.EDIT,
                type: 'primary',
                ghost: true,
                auth: 'demo:tree:edit',
                onClick: handleEdit.bind(null, record),
              },
              {
                label: '删除',
                icon: IconEnum.DELETE,
                type: 'primary',
                danger: true,
                ghost: true,
                auth: 'demo:tree:remove',
                popConfirm: {
                  placement: 'left',
                  title: '是否删除测试树[' + record.id + ']?',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <TreeModal @register="registerModal" @reload="reload" />
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '@/components/Page';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { treeList, treeRemove } from './api';
  import type { TreeVO } from './api/model';
  import { useModal } from '@/components/Modal';
  import TreeModal from './TreeModal.vue';
  import { formSchems, columns } from './tree.data';
  import { listToTree, removeEmptyChildren } from '@/utils/helper/treeHelper';
  import { IconEnum } from '@/enums/appEnum';

  defineOptions({ name: 'Tree' });

  const [registerTable, { reload, expandAll, collapseAll }] = useTable({
    api: treeList,
    title: '测试树列表',
    showIndexColumn: false,
    isTreeTable: true,
    pagination: false,
    rowKey: 'id}',
    afterFetch(data: TreeVO[]) {
      const ret = listToTree(data, { id: 'id', pid: 'parentId' });
      removeEmptyChildren(ret);
      return ret;
    },
    useSearchForm: true,
    formConfig: {
      schemas: formSchems,
      baseColProps: {
        span: 8,
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

  const [registerModal, { openModal }] = useModal();

  function handleEdit(record: Recordable) {
    openModal(true, { record, update: true });
  }

  function handleAdd() {
    openModal(true, { update: false });
  }

  async function handleDelete(record: Recordable) {
    await treeRemove(record.id);
    await reload();
  }
</script>

<style scoped></style>
