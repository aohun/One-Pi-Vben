<template>
  <PageWrapper dense>
    <BasicTable
      @register="registerTable"
      @fetch-success="onFetchSuccess"
      @row-db-click="handleDoubleClick"
    >
      <template v-if="!read" #headerTop>
        <Alert
          class="h-30px"
          message="提示: 双击行可展开/折叠内容"
          type="info"
          banner
          closable
          @close="read = true"
        />
      </template>
      <template #toolbar>
        <a-button @click="handleExpandOrCollapseAll('expandAll')">展开</a-button>
        <a-button @click="handleExpandOrCollapseAll('collapseAll')">折叠</a-button>
        <a-button
          @click="downloadExcel(categoryExport, '流程分类', getForm().getFieldsValue())"
          v-auth="'workflow:category:export'"
          >导出</a-button
        >
        <a-button type="primary" @click="handleAdd(0)" v-auth="'workflow:category:add'">
          新增
        </a-button>
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
                auth: 'workflow:category:edit',
                onClick: handleEdit.bind(null, record),
              },
              {
                label: '新增',
                icon: IconEnum.ADD,
                type: 'primary',
                color: 'success',
                ghost: true,
                auth: 'workflow:category:add',
                onClick: handleAdd.bind(null, record.id),
              },
              {
                label: '删除',
                icon: IconEnum.DELETE,
                type: 'primary',
                danger: true,
                ghost: true,
                auth: 'workflow:category:remove',
                popConfirm: {
                  title: `是否删除分类[${record.categoryName}]`,
                  placement: 'left',
                  confirm: handleRemove.bind(null, record.id),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <CategoryModal @register="registerModal" @reload="reload" />
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '@/components/Page';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { categoryList, categoryRemove, categoryExport } from '@/api/workflow/category';
  import { downloadExcel } from '@/utils/file/download';
  import { Category } from '@/api/workflow/category/model';
  import { Alert } from 'ant-design-vue';
  import CategoryModal from './CategoryModal.vue';
  import { useModal } from '@/components/Modal';
  import { nextTick } from 'vue';
  import { formSchemas, columns } from './category.data';
  import { listToTree, removeEmptyChildren } from '@/utils/helper/treeHelper';
  import { IconEnum } from '@/enums/appEnum';
  import { useLocalStorage } from '@vueuse/core';

  defineOptions({ name: 'Category' });

  /** 是否已读提示 */
  const read = useLocalStorage('category.read', false);

  const [
    registerTable,
    { getRawDataSource, expandRows, collapseRows, expandAll, collapseAll, reload, getForm },
  ] = useTable({
    title: '流程分类列表',
    isTreeTable: true,
    showTableSetting: true,
    api: categoryList,
    pagination: false,
    rowKey: 'id',
    afterFetch(data: Category[]) {
      const categoryTree = listToTree(data, { id: 'id', pid: 'parentId' });
      removeEmptyChildren(categoryTree);
      return categoryTree;
    },
    useSearchForm: true,
    formConfig: {
      schemas: formSchemas,
      baseColProps: {
        xs: 24,
        sm: 24,
        md: 24,
        lg: 6,
      },
    },
    columns: columns,
    actionColumn: {
      title: '操作',
      key: 'action',
      fixed: 'right',
    },
  });

  function onFetchSuccess() {
    // 需要添加上expand标记
    const rawDataSource = getRawDataSource();
    if (!(rawDataSource instanceof Array)) {
      return;
    }
    rawDataSource.forEach((item) => {
      item.expand = true;
    });
    // 默认展开全部
    nextTick(expandAll);
  }

  const [registerModal, { openModal }] = useModal();

  function handleEdit(record: Recordable) {
    const { id } = record;
    openModal(true, { id, update: true });
  }

  function handleAdd(id: string | number) {
    openModal(true, { id, update: false });
  }

  async function handleRemove(id: string | number) {
    await categoryRemove([id]);
    await reload();
  }

  type ExpandOrCollapseType = 'expandAll' | 'collapseAll';
  function handleExpandOrCollapseAll(type: ExpandOrCollapseType) {
    // 拿到表格原始数据 响应式
    const rawDataSource = getRawDataSource();
    if (!(rawDataSource instanceof Array)) {
      return;
    }
    // 添加expand字段 用于记录是否展开
    switch (type) {
      case 'expandAll':
        rawDataSource.forEach((item) => {
          item.expand = true;
        });
        expandAll();
        break;
      case 'collapseAll':
        rawDataSource.forEach((item) => {
          item.expand = false;
        });
        collapseAll();
        break;
    }
  }

  /**
   * 行双击事件  展开/折叠
   * @param record
   */
  function handleDoubleClick(record: Recordable) {
    const { id } = record;
    if (record.expand === true) {
      collapseRows([id]);
      record.expand = false;
    } else {
      expandRows([id]);
      record.expand = true;
    }
  }
</script>

<style scoped></style>
