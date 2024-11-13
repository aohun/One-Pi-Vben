<template>
  <PageWrapper>
    <BasicTable @register="registerTable">
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
            dropDownBtnDisplay
            :actions="[
              {
                label: record.suspensionState == 1 ? '挂起流程' : '激活流程',
                icon: record.suspensionState == 1 ? IconEnum.LOCK : IconEnum.UNLOCK,
                onClick: handleActiveOrNot.bind(null, record),
              },
              {
                label: '转换模型',
                icon: 'lets-icons:transger',
                onClick: handleConvertToModel.bind(null, record),
              },
              {
                label: '删除',
                icon: IconEnum.DELETE,
                danger: true,
                onClick: handleRemove.bind(null, record),
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <PreviewModal @register="registerModal" />
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '@/components/Page';
  import {
    getListByKey,
    convertToModel,
    processDefinitionRemove,
    updateDefinitionState,
  } from '@/api/workflow/processDefinition';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { columns } from '@/views/workflow/processDefinition/definition.data';
  // import { PreviewType } from './type';
  import { IconEnum } from '@/enums/appEnum';
  import { onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { useModal } from '@/components/Modal';
  import PreviewModal from '@/views/workflow/processDefinition/PreviewModal.vue';
  import { PreviewType } from '@/views/workflow/processDefinition/type';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useTabs } from '@/hooks/web/useTabs';

  defineOptions({ name: 'WorkflowDefinitionHistoryPage' });

  defineEmits(['register', 'preview']);

  const route = useRoute();
  const currentKey = (route.params.key as string) || '0';
  console.log(currentKey);

  onMounted(async () => {
    await handleSetTableData();
  });

  const [registerTable, { setTableData }] = useTable({
    showIndexColumn: false,
    rowKey: 'id',
    useSearchForm: false,
    columns,
    actionColumn: {
      width: 300,
      title: '操作',
      key: 'action',
      fixed: 'right',
    },
    showTableSetting: false,
    pagination: false,
    inset: true,
    size: 'small',
  });

  const { setTitle } = useTabs();
  async function handleSetTableData() {
    const ret = await getListByKey(currentKey);
    setTableData(ret);

    // 设置tab标题
    if (ret && ret.length) {
      const { name } = ret[0];
      setTitle('历史记录: ' + name);
    }
  }

  const { createConfirm } = useMessage();
  async function handleRemove(record: Recordable) {
    createConfirm({
      iconType: 'warning',
      title: '提示',
      content: `是否确认删除[${record.name}] - [${record.key}]`,
      onOk: async () => {
        const { deploymentId, id } = record;
        await processDefinitionRemove(deploymentId, id);
        await handleSetTableData();
      },
    });
  }

  /**
   * 挂起/激活
   * @param record
   */
  function handleActiveOrNot(record: Recordable) {
    const state = record.suspensionState == '1' ? '暂停' : '启动';
    const allow = record.suspensionState == '1' ? '不允许' : '允许';
    const action = record.suspensionState == '1' ? '挂起' : '激活';
    createConfirm({
      iconType: 'warning',
      title: '提示',
      content: `${state}后，此流程下的所有任务都${allow}往后流转，您确定${action}【${record.name}】吗？`,
      onOk: async () => {
        await updateDefinitionState(record.id);
        await handleSetTableData();
      },
    });
  }

  function handleConvertToModel(record: Recordable) {
    createConfirm({
      iconType: 'info',
      title: '提示',
      content: `是否确认转换为模型[${record.name}] - [${record.key}]`,
      onOk: async () => {
        await convertToModel(record.id);
        await handleSetTableData();
      },
    });
  }

  const [registerModal, { openModal }] = useModal();
  function handlePreview(type: PreviewType, record: Recordable) {
    // 接受一个ID
    openModal(true, { type, id: record.id });
  }
</script>

<style scoped></style>
