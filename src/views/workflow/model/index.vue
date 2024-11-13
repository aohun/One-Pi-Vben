<template>
  <PageWrapper dense>
    <Row>
      <!-- 左边部门选择 -->
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
          <template #toolbar>
            <a-button
              @click="handleExportZip"
              :disabled="!selected"
              v-auth="'workflow:model:export'"
              >导出</a-button
            >
            <a-button
              class="<sm:hidden"
              type="primary"
              danger
              @click="multipleRemove(flowModelRemove)"
              v-auth="'workflow:model:remove'"
              :disabled="!selected"
              >删除</a-button
            >
            <a-button type="primary" @click="handleAdd" v-auth="'workflow:model:add'"
              >新增</a-button
            >
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <TableAction
                stopButtonPropagation
                dropDownBtnDisplay
                :actions="[
                  {
                    label: '设计',
                    icon: 'streamline:text-flow-rows',
                    onClick: handleToBpmnDesign.bind(null, record),
                  },
                  {
                    label: '修改',
                    icon: IconEnum.EDIT,
                    onClick: handleEdit.bind(null, record),
                  },
                ]"
              />
              <TableAction
                stopButtonPropagation
                :actions="[
                  {
                    label: '部署',
                    icon: 'clarity:deploy-line',
                    popConfirm: {
                      placement: 'left',
                      title: `是否确认部署[${record.name}] - [${record.key}]`,
                      confirm: handleDeploy.bind(null, record),
                    },
                  },
                  {
                    label: '删除',
                    icon: IconEnum.DELETE,
                    danger: true,
                    popConfirm: {
                      placement: 'left',
                      title: `是否确认删除[${record.name}] - [${record.key}]`,
                      confirm: handleRemove.bind(null, record),
                    },
                  },
                ]"
              />
            </template>
          </template>
        </BasicTable>
        <ModelModal @register="registerModal" @reload="reload" />
      </Col>
    </Row>
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '@/components/Page';
  import { Row, Col, Skeleton } from 'ant-design-vue';
  import { BasicTree } from '@/components/Tree/index';
  import {
    flowModelList,
    flowModelRemove,
    flowModelDeploy,
    flowModelExportZip,
  } from '@/api/workflow/model';
  import { downloadByData } from '@/utils/file/download';
  import { categoryList } from '@/api/workflow/category';
  import { onMounted, reactive, ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { columns, schemas } from './model.data';
  import { IconEnum } from '@/enums/appEnum';
  import { listToTree, addFullName, eachTree } from '@/utils/helper/treeHelper';
  import { useModal } from '@/components/Modal';
  import ModelModal from './ModelModal.vue';
  import { useGo } from '@/hooks/web/usePage';

  // 缓存
  defineOptions({ name: 'Model' });

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
    addFullName(treeData, 'categoryName', ' -> ');
    data.tree = treeData;
    showTreeSkeleton.value = false;
  });

  const [registerTable, { reload, selected, multipleRemove, getSelectRowKeys }] = useTable({
    rowSelection: {
      type: 'checkbox',
    },
    title: '流程模型列表',
    showIndexColumn: false,
    api: flowModelList,
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
      resetFunc: async () => {
        data.selectId = [];
        categorySearchText.value = '';
      },
    },
    columns,
    // 需要添加上categoryCode参数
    beforeFetch(params: Recordable) {
      if (data.selectId.length === 1) {
        params.categoryCode = data.selectId[0];
      }
      return params;
    },
    actionColumn: {
      width: 180,
      title: '操作',
      key: 'action',
      fixed: 'right',
    },
  });

  const [registerModal, { openModal }] = useModal();

  function handleAdd() {
    openModal(true, { update: false });
  }

  function handleEdit(record: Recordable) {
    const { id } = record;
    openModal(true, { update: true, id });
  }

  // 部署
  async function handleDeploy(record: Recordable) {
    await flowModelDeploy(record.id);
    await reload();
  }

  /**
   * 支持
   */
  async function handleExportZip(record?: Recordable) {
    let fileName = `模型导出-${new Date().getTime()}.zip`;
    let ids = getSelectRowKeys();
    if (record) {
      fileName = `${record.name} - ${record.key}.zip`;
      ids = [record.id];
    }
    const blob = await flowModelExportZip(ids);
    downloadByData(blob, fileName);
    await reload();
  }

  async function handleRemove(record: Recordable) {
    await flowModelRemove([record.id]);
    await reload();
  }

  // 前往流程设计页面
  const go = useGo();
  function handleToBpmnDesign(record: Recordable) {
    go(`/workflow/design/${record.id}`);
  }
</script>

<style lang="less" scoped>
  /** 去掉表格padding */
  :deep(.vben-basic-table-form-container) {
    padding: 5px;
  }
</style>
