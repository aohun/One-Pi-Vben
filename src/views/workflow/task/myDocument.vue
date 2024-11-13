<template>
  <PageWrapper dense>
    <Row>
      <!-- 左边选择 -->
      <Col v-bind="{ xs: 24, sm: 24, md: 24, lg: 4 }" class="h-[calc(100vh-80px)]">
        <Skeleton :active="true" :paragraph="{ rows: 8 }" :loading="showTreeSkeleton">
          <BasicTree
            v-if="data.tree.length"
            :fieldNames="{ title: 'categoryName', key: 'categoryCode' }"
            :tree-data="data.tree"
            :showLine="{ showLeafIcon: false }"
            :search="true"
            v-model:searchValue="categorySearchText"
            defaultExpandAll
            @select="handleSelect"
            v-model:selectedKeys="data.selectId"
          />
        </Skeleton>
      </Col>
      <!-- 右边表格及菜单 -->
      <Col v-bind="{ xs: 24, sm: 24, md: 24, lg: 20 }">
        <BasicTable @register="registerTable">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <TableAction
                stopButtonPropagation
                :actions="[
                  {
                    label: '记录',
                    icon: IconEnum.PREVIEW,
                    onClick: handleToApproveRecord.bind(null, record),
                  },
                  {
                    label: '重新提交',
                    icon: IconEnum.EDIT,
                    onClick: handleReSubmit.bind(null, record),
                    ifShow:
                      record.businessStatus === 'draft' ||
                      record.businessStatus === 'cancel' ||
                      record.businessStatus === 'back',
                  },
                ]"
              />
              <TableAction
                stopButtonPropagation
                :actions="[
                  {
                    label: '删除',
                    icon: IconEnum.PREVIEW,
                    danger: true,
                    popConfirm: {
                      title: '是否确认删除',
                      placement: 'left',
                      confirm: handleDelete.bind(null, record),
                    },
                    ifShow:
                      record.businessStatus === 'draft' ||
                      record.businessStatus === 'cancel' ||
                      record.businessStatus === 'back',
                  },
                  {
                    label: '撤销',
                    icon: IconEnum.DELETE,
                    danger: true,
                    popConfirm: {
                      placement: 'left',
                      title: `是否确认撤销[${record.processDefinitionName}]流程?`,
                      confirm: handleRevoke.bind(null, record),
                    },
                    ifShow: record.businessStatus === 'waiting',
                  },
                ]"
              />
            </template>
          </template>
        </BasicTable>
      </Col>
    </Row>
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '@/components/Page';
  import { Row, Col, Skeleton } from 'ant-design-vue';
  import { BasicTree } from '@/components/Tree/index';
  import { categoryList } from '@/api/workflow/category';
  import {
    getPageByCurrent,
    cancelProcessApply,
    deleteRunAndHisInstance,
  } from '@/api/workflow/processInstance';
  import { onMounted, reactive, ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { columns, schemas } from './myDocument/data';
  import { IconEnum } from '@/enums/appEnum';
  import { listToTree, addFullName, eachTree } from '@/utils/helper/treeHelper';
  import { useGo } from '@/hooks/web/usePage';

  interface TreeProps {
    tree: any[];
    selectId: string[];
  }
  /** 左边搜索框 */
  const categorySearchText = ref<string>('');
  const data: TreeProps = reactive({
    tree: [],
    selectId: [],
  });
  const showTreeSkeleton = ref<boolean>(true);

  // 选中后刷新表格
  async function handleSelect() {
    await reload();
  }

  onMounted(async () => {
    const ret = await categoryList();
    let treeData = listToTree(ret, { id: 'id', pid: 'parentId' });
    treeData = [
      {
        categoryName: '根目录',
        id: 0,
        children: treeData,
      },
    ];
    // 添加节点前图标 不需要 注释eachTree即可
    eachTree(treeData, (item) => {
      item.icon = 'flat-color-icons:folder';
    });
    // 添加名称 如 xx-xx-xx
    addFullName(treeData, 'categoryName', ' / ');
    data.tree = treeData;
    showTreeSkeleton.value = false;
  });

  const [registerTable, { reload }] = useTable({
    rowSelection: {
      type: 'checkbox',
    },
    title: '我发起的流程列表',
    showIndexColumn: false,
    api: getPageByCurrent,
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
      resetFunc: async () => {
        data.selectId = [];
        categorySearchText.value = '';
        // await reload();
      },
    },
    columns,
    // 需要添加上流程参数
    beforeFetch(params: Recordable) {
      if (data.selectId.length === 1) {
        params.categoryCode = data.selectId[0];
      }
      return params;
    },
    actionColumn: {
      width: 220,
      title: '操作',
      key: 'action',
      fixed: 'right',
    },
  });

  // 前往审批记录页面
  const go = useGo();
  function handleToApproveRecord(record: Recordable) {
    // 前往审批记录页面
    const url = record.wfNodeConfigVo.wfFormManageVo.router;
    go({ path: url, query: { id: record.businessKey, type: 'preview' } });
  }

  async function handleRevoke(record: Recordable) {
    await cancelProcessApply(record.businessKey);
    await reload();
  }

  // 重新提交流程
  function handleReSubmit(record: Recordable) {
    const url = record.wfNodeConfigVo.wfFormManageVo.router;
    go({ path: url, query: { id: record.businessKey, type: 'update' } });
  }

  async function handleDelete(record: Recordable) {
    await deleteRunAndHisInstance([record.businessKey]);
    await reload();
  }
</script>

<style lang="less" scoped>
  /** 去掉表格padding */
  :deep(.vben-basic-table-form-container) {
    padding: 5px;
  }
</style>
