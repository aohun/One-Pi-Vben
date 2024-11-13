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
            <a-button type="primary" danger :disabled="!selected" @click="handleMultipleRemove"
              >删除</a-button
            >
            <a-button type="primary" @click="handleDeploy">部署</a-button>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column && record && column.key === 'resourceName'">
              <a-button type="link" @click="handlePreview('xml', record)">{{
                record.resourceName
              }}</a-button>
            </template>
            <template v-if="column && record && column.key === 'diagramResourceName'">
              <a-button type="link" @click="handlePreview('image', record)">{{
                record.diagramResourceName
              }}</a-button>
            </template>
            <template v-if="column && record && column.key === 'action'">
              <TableAction
                stopButtonPropagation
                :actions="[
                  {
                    label: record.suspensionState == 1 ? '挂起流程' : '激活流程',
                    icon: record.suspensionState == 1 ? IconEnum.LOCK : IconEnum.UNLOCK,
                    popConfirm: {
                      placement: 'left',
                      title: activeOrNotText(record),
                      confirm: handleActiveOrNot.bind(null, record),
                    },
                  },
                  {
                    label: '删除流程',
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
              <TableAction
                stopButtonPropagation
                :actions="[
                  {
                    label: '转换模型',
                    icon: 'lets-icons:transger',
                    popConfirm: {
                      placement: 'left',
                      title: `是否确认转换为模型[${record.name}] - [${record.key}]`,
                      confirm: handleConvertToModel.bind(null, record),
                    },
                  },
                  {
                    label: '历史版本',
                    icon: 'ic:sharp-history',
                    onClick: handleToHistory.bind(null, record),
                  },
                ]"
              />
              <TableAction
                stopButtonPropagation
                :actions="[
                  {
                    label: '绑定业务',
                    icon: 'lets-icons:transger',
                    onClick: handleFormConfig.bind(null, record),
                  },
                ]"
              />
            </template>
          </template>
        </BasicTable>
        <PreviewModal @register="registerPreviewModal" />
        <DeployModal @register="registerDeployModal" @reload="reload" />
        <FormConfigModal @register="registerFormConfigModal" @reload="reload" />
      </Col>
    </Row>
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '@/components/Page';
  import { Row, Col, Skeleton } from 'ant-design-vue';
  import { BasicTree } from '@/components/Tree/index';
  import {
    processDefinitionList,
    convertToModel,
    processDefinitionRemove,
    updateDefinitionState,
  } from '@/api/workflow/processDefinition';
  import { categoryList } from '@/api/workflow/category';
  import { onMounted, reactive, ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { columns, schemas } from './definition.data';
  import { IconEnum } from '@/enums/appEnum';
  import { listToTree, addFullName, eachTree } from '@/utils/helper/treeHelper';
  import { useModal } from '@/components/Modal';
  import DeployModal from './DeployModal.vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import PreviewModal from './PreviewModal.vue';
  import { PreviewType } from './type';
  import { useGo } from '@/hooks/web/usePage';
  import FormConfigModal from './FormConfigModal.vue';

  // 缓存
  defineOptions({ name: 'ProcessDefinition' });

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

  const [registerTable, { reload, selected, getSelectRows }] = useTable({
    rowSelection: {
      type: 'checkbox',
    },
    title: '流程定义列表',
    showIndexColumn: false,
    api: processDefinitionList,
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
    // 需要添加上categoryCode参数
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

  const [registerPreviewModal, { openModal: openPreviewModal }] = useModal();
  const [registerDeployModal, { openModal: openDeployModal }] = useModal();
  const [registerFormConfigModal, { openModal: openFormConfigModal }] = useModal();

  function handlePreview(type: PreviewType, record: Recordable) {
    // 接受一个ID
    openPreviewModal(true, { type, id: record.id });
  }

  /**
   * 表单配置
   */
  function handleFormConfig(record: Recordable) {
    openFormConfigModal(true, record);
  }

  const go = useGo();
  function handleToHistory(record: Recordable) {
    // 这里接受key
    go(`/workflow/definition/history/${record.key}`);
  }

  async function handleRemove(record: Recordable) {
    const { deploymentId, id } = record;
    await processDefinitionRemove(deploymentId, id);
    await reload();
  }

  const { createMessage, createConfirm } = useMessage();
  // 部署
  function handleDeploy() {
    console.log(data.selectId);
    if (data.selectId.length !== 1) {
      createMessage.warning('请在左侧选择要上传的分类');
      return;
    }
    // 为undefined 顶级节点  不可部署(官方目前是这样)
    if (data.selectId.length === 1 && !data.selectId[0]) {
      createMessage.warning('不可上传到根目录, 请选择子目录上传');
      return;
    }
    const categoryCode = data.selectId[0];
    // 打开modal
    openDeployModal(true, categoryCode);
  }

  /**
   * 挂起/激活
   * @param record
   */
  async function handleActiveOrNot(record: Recordable) {
    await updateDefinitionState(record.id);
    await reload();
  }

  /**
   * 挂起/激活
   * @param record
   */
  function activeOrNotText(record: Recordable) {
    const state = record.suspensionState == '1' ? '暂停' : '启动';
    const allow = record.suspensionState == '1' ? '不允许' : '允许';
    const action = record.suspensionState == '1' ? '挂起' : '激活';
    return `${state}后，此流程下的所有任务都${allow}往后流转, 您确定${action}【${record.name}】吗?`;
  }

  async function handleConvertToModel(record: Recordable) {
    await convertToModel(record.id);
    await reload();
  }

  function handleMultipleRemove() {
    createConfirm({
      title: '提示',
      iconType: 'warning',
      content: '确定要删除选中的流程定义吗?',
      okButtonProps: {
        type: 'primary',
        danger: true,
      },
      onOk: async () => {
        const rows = getSelectRows();
        const deploymentIds = rows.map((item) => item.deploymentId).join(',');
        const processDefinitionIds = rows.map((item) => item.id).join(',');
        await processDefinitionRemove(deploymentIds, processDefinitionIds);
        await reload();
      },
    });
  }
</script>

<style lang="less" scoped>
  /** 去掉表格padding */
  :deep(.vben-basic-table-form-container) {
    padding: 5px;
  }
</style>
