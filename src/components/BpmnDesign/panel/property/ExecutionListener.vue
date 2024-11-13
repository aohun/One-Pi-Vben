<template>
  <div>
    <BasicTable :expand-column-width="30" @register="registerTable">
      <template #bodyCell="{ record, column }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '编辑',
                onClick: handleEdit.bind(null, record),
              },
              {
                label: '删除',
                danger: true,
                popConfirm: {
                  placement: 'left',
                  title: '是否确认删除',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
      <template #expandedRowRender="{ record }">
        <p>表达式/类名: {{ record.className }}</p>
      </template>
    </BasicTable>
    <a-button class="mt-8px" @click="handleAdd" block>新增监听器</a-button>
    <ListenerModal @register="registerModal" @add="onAdd" @edit="onEdit" />
  </div>
</template>

<script setup lang="ts">
  import { useModal } from '@/components/Modal';
  import ListenerModal from './ListenerModal.vue';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import type { ModdleElement } from 'bpmn';
  import { onMounted, toRaw } from 'vue';
  import useModelerStore from '@/store/modules/modeler';
  import usePanel from '../../hooks/usePanel';
  import { columns } from './executionListener.data';

  /**
   * 执行监听器
   */
  defineOptions({ name: 'ExecutionListener' });

  interface PropType {
    element: ModdleElement;
  }
  const props = withDefaults(defineProps<PropType>(), {});

  const [registerModal, { openModal }] = useModal();
  /**
   * 新增
   */
  function handleAdd() {
    openModal(true, { isEdit: false });
  }

  /**
   * 新增后回调
   */
  function onAdd(data: Data) {
    const tableData = getDataSource<Data>();
    tableData.push(data);
    // 更新xml
    updateElement(tableData);
  }

  /**
   * 编辑
   */
  function handleEdit(record: Recordable) {
    openModal(true, { isEdit: true, record });
  }

  /**
   * 编辑后回调
   */
  function onEdit(data: Data, key: string) {
    const tableData = getDataSource<Data>();
    const index = tableData.findIndex((row) => row.key === key);
    if (index !== -1) {
      // 响应式  直接修改
      tableData[index] = data;
      // 更新xml
      updateElement(tableData);
    }
  }

  function handleDelete(record: Recordable) {
    // 这里拿到的是响应式reactive 直接删除即可
    const tableData = getDataSource<Data>();
    // 根据key删除
    const { key = '' } = record;
    const index = tableData.findIndex((row) => row.key === key);
    if (index !== -1) {
      // 从表格去除
      tableData.splice(index, 1);
      // 更新xml
      updateElement(tableData);
    }
  }

  const [registerTable, { setTableData, getDataSource }] = useTable({
    clickToRowSelect: false,
    size: 'small',
    showIndexColumn: false,
    showTableSetting: false,
    inset: true,
    bordered: true,
    columns,
    pagination: false,
    scroll: {
      y: 300,
    },
    actionColumn: {
      title: '操作',
      dataIndex: 'action',
      width: 100,
    },
  });

  const { updateProperties } = usePanel({
    element: toRaw(props.element),
  });
  const { getModdle } = useModelerStore();
  const moddle = getModdle();

  interface Data {
    /** 用于区分 */
    key?: string;
    className: string;
    event: string;
    type: string;
    params: Recordable[];
  }

  /**
   * data为整个表格的数据 全量更新
   */
  function updateElement(data: Data[]) {
    // 设置xml数据
    if (data.length) {
      let extensionElements: any = props.element.businessObject.get('extensionElements');
      if (!extensionElements) {
        extensionElements = moddle?.create('bpmn:ExtensionElements');
      }
      // 清除旧值
      extensionElements.values =
        extensionElements.values?.filter((item) => item.$type !== 'flowable:ExecutionListener') ??
        [];
      data.forEach((item) => {
        const executionListener = moddle?.create('flowable:ExecutionListener');
        if (!executionListener) return;
        executionListener['event'] = item.event;
        executionListener[item.type] = item.className;
        if (item.params && item.params.length) {
          item.params.forEach((field) => {
            const fieldElement = moddle?.create('flowable:Field');
            if (!fieldElement) return;
            fieldElement['name'] = field.name;
            fieldElement[field.type] = field.value;
            executionListener.get<any>('fields').push(fieldElement);
          });
        }
        extensionElements.get('values').push(executionListener);
      });
      updateProperties({ extensionElements: extensionElements });
    } else {
      const extensionElements = props.element.businessObject[`extensionElements`];
      if (extensionElements) {
        extensionElements.values =
          extensionElements.values?.filter((item) => item.$type !== 'flowable:ExecutionListener') ??
          [];
      }
    }
  }

  function initTableData() {
    // 可能为undefined 必须判断
    const data = props.element.businessObject.extensionElements?.values;
    if (!data) return;
    const tableData =
      props.element.businessObject.extensionElements?.values
        .filter((item) => item.$type === 'flowable:ExecutionListener')
        .map((item) => {
          let type;
          if ('class' in item) type = 'class';
          if ('expression' in item) type = 'expression';
          if ('delegateExpression' in item) type = 'delegateExpression';
          return {
            event: item.event,
            type: type,
            className: item[type],
            params:
              item.fields?.map((field) => {
                let fieldType;
                if ('stringValue' in field) fieldType = 'stringValue';
                if ('expression' in field) fieldType = 'expression';
                return {
                  name: field.name,
                  type: fieldType,
                  value: field[fieldType],
                };
              }) ?? [],
          };
        }) ?? [];
    // 设置到表格
    setTableData(tableData);
  }

  onMounted(() => {
    initTableData();
  });
</script>

<style scoped></style>
