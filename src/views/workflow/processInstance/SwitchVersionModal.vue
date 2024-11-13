<template>
  <BasicModal v-bind="$attrs" title="切换版本" :width="1000" @register="registerModalInner">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column && record && column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                label: '切换',
                icon: 'icon-park-outline:switch',
                popConfirm: {
                  placement: 'left',
                  title: `是否确认切换版本为[v${record.version}.0]?`,
                  confirm: handleSwitch.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <template #footer></template>
  </BasicModal>
</template>

<script setup lang="ts">
  import { useModalInner, BasicModal } from '@/components/Modal';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { getListByKey, migrationDefinition } from '@/api/workflow/processDefinition';
  import { useRender } from '@/hooks/component/useRender';
  import { ref, unref } from 'vue';

  defineOptions({ name: 'SwitchVersionModal' });

  const emit = defineEmits(['register', 'reload']);

  // 当前的id
  const currentProcessDefinitionId = ref<string>('');
  const [registerModalInner, { modalLoading, closeModal }] = useModalInner(
    async (data: { processDefinitionKey: string; processDefinitionId: string }) => {
      modalLoading(true);

      const { processDefinitionKey, processDefinitionId } = data;
      currentProcessDefinitionId.value = processDefinitionId;
      // 获取数据
      const result = await getListByKey(processDefinitionKey);
      // 设置表格数据
      setTableData(result);

      modalLoading(false);
    },
  );

  const { renderTag } = useRender();
  const [registerTable, { setTableData }] = useTable({
    showIndexColumn: true,
    rowKey: 'id',
    useSearchForm: false,
    size: 'small',
    pagination: false,
    columns: [
      {
        dataIndex: 'name',
        title: '流程名称',
      },
      {
        dataIndex: 'key',
        title: '流程key',
      },
      {
        dataIndex: 'version',
        title: '版本号',
        customRender({ value }) {
          return `v${value}.0`;
        },
      },
      {
        dataIndex: 'suspensionState',
        title: '流程状态',
        customRender({ value }) {
          return renderTag(value);
        },
      },
      {
        dataIndex: 'deploymentTime',
        title: '部署时间',
      },
    ],
    showTableSetting: false,
    actionColumn: {
      width: 150,
      title: '操作',
      key: 'action',
      fixed: 'right',
    },
  });

  // put http://localhost:81/prod-api/workflow/processDefinition/migrationProcessDefinition/leave7:2:1765381669078126595/leave7:3:1765382088600801283
  async function handleSwitch(record: Recordable) {
    // 切换的id
    const toProcessDefinitionId = record.id;
    // 提交
    await migrationDefinition(unref(currentProcessDefinitionId), toProcessDefinitionId);
    // 关闭
    emit('reload');
    closeModal();
  }
</script>

<style scoped></style>
