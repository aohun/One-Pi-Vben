<template>
  <BasicModal
    v-bind="$attrs"
    title="监听器"
    :width="700"
    @register="registerModalInner"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
    <!-- 使用VxeTable代替Ant -->
    <div class="w-full px-6 mb-16px flex gap-8px">
      <a-button @click="handleInsert">新增</a-button>
      <a-button @click="handleRemoveSelect">选中删除</a-button>
    </div>
    <VxeBasicTable ref="tableRef" v-bind="gridOptions" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { BasicForm, useForm } from '@/components/Form';
  import { ref, unref, reactive } from 'vue';
  import {
    schemas,
    vxeTableColumns,
    validRules,
    ListenerType,
    eventSelectOptions,
    taskEventSelectOptions,
  } from './listener.data';
  import { cloneDeep, omit } from 'lodash-es';
  import { BasicTableProps, VxeBasicTable, VxeGridInstance } from '@/components/VxeTable';

  /**
   * 执行/任务监听器的modal
   */
  defineOptions({ name: 'ListenerModal' });

  const props = defineProps({
    type: {
      type: String as PropType<ListenerType>,
      default: 'executionListener',
    },
  });
  const emit = defineEmits(['register', 'add', 'edit']);

  const editKey = ref<string>('');
  const [registerModalInner, { closeModal }] = useModalInner(
    async (data: { isEdit: boolean; record?: Recordable }) => {
      /** 每次打开进行重置 */
      handleReset();

      const { isEdit, record } = data;

      /** 编辑 */
      if (isEdit && record) {
        // 去掉params和key就是form的data
        const formData = omit(record, ['params', 'key']);
        await setFieldsValue(formData);
        // 表格的data
        const tableData = record.params;
        // 设置tableData
        if (tableRef.value) {
          gridOptions.data = tableData;
        }
        // key 用于区分是哪个修改了
        editKey.value = record.key;
      }

      // 根据不同的listener设置options
      updateSchema({
        field: 'event',
        componentProps: {
          options: props.type === 'executionListener' ? eventSelectOptions : taskEventSelectOptions,
        },
      });
    },
  );

  async function handleReset() {
    await resetForm();
    editKey.value = '';
    gridOptions.data = [];
  }

  const [registerForm, { setFieldsValue, validate, resetForm, updateSchema }] = useForm({
    name: 'listener_form',
    labelWidth: 100,
    showActionButtonGroup: false,
    baseColProps: {
      span: 24,
    },
    schemas,
  });

  const tableRef = ref<VxeGridInstance>();
  const gridOptions = reactive<BasicTableProps>({
    id: 'VxeTable',
    keepSource: true,
    border: true,
    editConfig: { trigger: 'click', mode: 'row', showStatus: true },
    columns: vxeTableColumns,
    toolbarConfig: {
      enabled: false,
    },
    columnConfig: {
      resizable: true,
    },
    data: [],
    proxyConfig: {
      // 必须设置
      enabled: false,
    },
    // 编辑rule校验
    editRules: validRules,
  });

  async function handleInsert() {
    const $table = tableRef.value;
    if ($table) {
      const record = {
        type: '',
        name: '',
        value: '',
      };
      // 在尾部插入
      const { row: newRow } = await $table.insertAt(record, -1);
      await $table.setEditCell(newRow, 'name');
    }
  }

  function handleRemoveSelect() {
    const $table = tableRef.value;
    if ($table) {
      $table.removeCheckboxRow();
    }
  }

  async function handleTableValidate() {
    const $table = tableRef.value;
    if (!$table) {
      return;
    }
    const hasError = await $table.validate();
    if (hasError) {
      return Promise.reject(new Error('编辑表格校验失败'));
    }
    // 使用getTableData才能拿到修改后的数据
    const tableData = $table.getTableData();
    return Promise.resolve(cloneDeep(tableData.fullData));
  }

  async function handleSubmit() {
    try {
      // 表单校验
      const formData = await validate();
      // 编辑行校验
      const tableData = await handleTableValidate();

      const fullData = { ...formData, params: tableData };
      // editKey不为空 说明为编辑
      if (unref(editKey)) {
        emit('edit', fullData, unref(editKey));
      } else {
        emit('add', fullData);
      }
      // 关闭modal
      closeModal();
    } catch (e) {
      console.warn(e);
    }
  }
</script>

<style lang="less" scoped>
  /** 去掉右边的padding 和上面表单同步 */
  :deep(.px-6) {
    padding-right: 0;
  }
</style>
