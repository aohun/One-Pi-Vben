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
          <template #toolbar>
            <a-button
              class="<sm:hidden"
              type="primary"
              danger
              @click="multipleRemove(multipleRemoveApi)"
              :disabled="!selected"
              >删除</a-button
            >
            <RadioGroup
              button-style="solid"
              v-model:value="currentState"
              @change="handleStateChange"
            >
              <RadioButton value="running">运行中</RadioButton>
              <RadioButton value="finished">已完成</RadioButton>
            </RadioGroup>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column && record && column.key === 'action'">
              <TableAction
                stopButtonPropagation
                :actions="[
                  {
                    label: '审批记录',
                    icon: IconEnum.PREVIEW,
                    onClick: handleToApproveRecord.bind(null, record),
                  },
                  {
                    label: '删除',
                    icon: IconEnum.DELETE,
                    danger: true,
                    popConfirm: {
                      placement: 'left',
                      title: `是否确认删除流程实例[${record.processDefinitionName}]`,
                      confirm: handleDelete.bind(null, record),
                    },
                  },
                ]"
              />
              <TableAction
                stopButtonPropagation
                :actions="[
                  {
                    label: '切换版本',
                    icon: 'mi:switch',
                    onClick: handleSwitchVersion.bind(null, record),
                    ifShow: record.isSuspended !== null,
                  },
                  {
                    label: '作废',
                    icon: 'flat-color-icons:cancel',
                    onClick: handleCancel.bind(null, record),
                    ifShow: record.isSuspended !== null,
                  },
                ]"
              />
            </template>
          </template>
        </BasicTable>
        <SwitchVersionModal @register="registerSwitchVersionModal" @reload="reload" />
        <CancelModal @register="registerCancelModal" @reload="reload" />
      </Col>
    </Row>
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '@/components/Page';
  import { Row, Col, Skeleton, RadioGroup, RadioButton } from 'ant-design-vue';
  import { BasicTree } from '@/components/Tree/index';
  import { categoryList } from '@/api/workflow/category';
  import { computed, onMounted, reactive, ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { columns, schemas } from './instance.data';
  import { IconEnum } from '@/enums/appEnum';
  import { listToTree, addFullName, eachTree } from '@/utils/helper/treeHelper';
  import { useModal } from '@/components/Modal';
  import {
    getPageByRunning,
    getPageByFinish,
    deleteRunAndHisInstance,
    deleteFinishAndHisInstance,
  } from '@/api/workflow/processInstance';
  import { useGo } from '@/hooks/web/usePage';
  import SwitchVersionModal from './SwitchVersionModal.vue';
  import CancelModal from './CancelModal.vue';

  // 缓存
  defineOptions({ name: 'ProcessInstance' });

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

  /**
   * 状态切换重新加载表格
   */
  type InstanceState = 'running' | 'finished';
  const currentState = ref<InstanceState>('running');
  async function handleStateChange() {
    const currentApi = currentState.value === 'running' ? getPageByRunning : getPageByFinish;
    setProps({ api: currentApi });
    // 设置endTime的显示
    columns[columns.length - 1].ifShow = currentState.value === 'finished';
    setColumns(columns);
    // 切换
    setTableData([]);
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

  const [registerTable, { setProps, reload, selected, multipleRemove, setColumns, setTableData }] =
    useTable({
      rowSelection: {
        type: 'checkbox',
      },
      title: '流程实例列表',
      showIndexColumn: false,
      api: getPageByRunning,
      rowKey: 'businessKey',
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
      // 需要添加上categoryCode参数
      beforeFetch(params: Recordable) {
        if (data.selectId.length === 1) {
          params.categoryCode = data.selectId[0];
        }
        return params;
      },
      actionColumn: {
        // width: 220,
        title: '操作',
        key: 'action',
        fixed: 'right',
      },
    });

  const go = useGo();
  function handleToApproveRecord(record: Recordable) {
    // 前往审批记录页面
    const url = record.wfNodeConfigVo.wfFormManageVo.router;
    go({ path: url, query: { id: record.businessKey, type: 'preview' } });
  }

  // 切换版本
  const [registerSwitchVersionModal, { openModal: openSwitchVersionModal }] = useModal();
  function handleSwitchVersion(record: Recordable) {
    // key用于获取 id用于提交
    const { processDefinitionKey, processDefinitionId } = record;
    openSwitchVersionModal(true, { processDefinitionKey, processDefinitionId });
  }

  // 作废
  const [registerCancelModal, { openModal: openCancelModal }] = useModal();
  function handleCancel(record: Recordable) {
    const { businessKey } = record;
    openCancelModal(true, businessKey);
  }

  const multipleRemoveApi = computed(() => {
    return currentState.value === 'running' ? deleteRunAndHisInstance : deleteFinishAndHisInstance;
  });
  // 删除
  async function handleDelete(record: Recordable) {
    await multipleRemoveApi.value([record.businessKey]);
    await reload();
  }
</script>

<style lang="less" scoped>
  /** 去掉表格padding */
  :deep(.vben-basic-table-form-container) {
    padding: 5px;
  }
</style>
