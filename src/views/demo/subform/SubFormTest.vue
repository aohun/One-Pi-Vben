<template>
  <PageWrapper dense contentClass="p-16px">
    <CollapseContainer title="表单信息">
      <Skeleton active v-show="loading" />
      <div v-show="!loading">
        <div v-show="isEdit">
          <BasicForm @register="registerForm" />
          <div class="w-full px-6 mb-16px flex gap-8px">
            <a-button type="dashed" @click="handleInsert">新增</a-button>
            <a-button @click="handleRemoveSelect">选中删除</a-button>
          </div>
          <VxeBasicTable ref="tableRef" v-bind="gridOptions" />
        </div>
        <div v-if="previewData && isPreview">
          <Preview :data="previewData" :records="previewData.subForm" />
        </div>
      </div>
    </CollapseContainer>
    <!-- 新增/修改显示 -->
    <div v-if="isEdit" class="flex justify-end gap-8px mt-8px">
      <a-button
        :loading="submitBtnLoading"
        :disabled="submitBtnLoading"
        @click="handleSubmit('temp')"
        >保存草稿</a-button
      >
      <a-button
        :loading="submitBtnLoading"
        :disabled="submitBtnLoading"
        type="primary"
        @click="handleSubmit('submit')"
        >提交</a-button
      >
    </div>
    <!-- 审批 表单 -->
    <CollapseContainer
      class="mt-16px"
      v-if="leaveOptions.type === 'approval' && leaveOptions.taskId"
      title="审批"
    >
      <ApprovalContent
        class="md:w-full lg:w-1/2"
        :taskId="leaveOptions.taskId"
        @reload="handleReload"
      />
    </CollapseContainer>
    <!-- 预览 -->
    <div v-if="isPreview && previewBusinessKey">
      <WorkFlowPreview :businessKey="previewBusinessKey" />
    </div>
    <!-- modal -->
    <PreSubmitModal
      :approvalMode="leaveOptions.type === 'approval'"
      :taskId="leaveOptions.taskId"
      @register="registerModal"
      @reload="handleReload"
    />
  </PageWrapper>
</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router';
  import { BasicForm, useForm } from '@/components/Form';
  import { Skeleton } from 'ant-design-vue';
  import { modalSchemas, vxeTableColumns, validRules } from './purchase.data';
  import { PageWrapper } from '@/components/Page';
  import { onMounted, computed, ref, reactive } from 'vue';
  import { purchaseAdd, purchaseUpdate, purchaseInfo } from './api';
  import { cloneDeep, omit } from 'lodash-es';
  import { useTabs } from '@/hooks/web/useTabs';
  import PreSubmitModal from '@/views/workflow/components/PreSubmitModal/index.vue';
  import { useModal } from '@/components/Modal';
  import { startWorkFlow } from '@/api/workflow/task';
  import WorkFlowPreview from '@/views/workflow/components/WorkFlowPreview/index.vue';
  import { CollapseContainer } from '@/components/Container';
  import ApprovalContent from '@/views/workflow/components/ApprovalContent/index.vue';
  import { VxeGridInstance } from 'vxe-table';
  import { BasicTableProps, VxeBasicTable } from '@/components/VxeTable';
  import { useMessage } from '@/hooks/web/useMessage';
  import Preview from './Preview';

  interface LeaveOptions {
    type: 'add' | 'update' | 'preview' | 'approval';
    id?: string;
    taskId?: string; // 节点ID 审批必填
  }

  /**
   * 区分编辑还是预览模式
   */
  const isEdit = computed(() => leaveOptions.type === 'add' || leaveOptions.type === 'update');
  const isPreview = computed(
    () => leaveOptions.type === 'preview' || leaveOptions.type === 'approval',
  );

  const route = useRoute();
  const leaveOptions = route.query as unknown as LeaveOptions;
  const previewBusinessKey = ref('');

  const previewData = ref<any>();

  const loading = ref(false);
  onMounted(async () => {
    loading.value = true;

    const { type, id = '' } = leaveOptions;
    if (!type) return;
    if (type === 'preview' || type === 'update' || type === 'approval') {
      await setProps({ disabled: type === 'preview' || type === 'approval' });
      /** 赋值 */
      const data = await purchaseInfo(id);
      previewBusinessKey.value = data.id as string;
      await setFieldsValue(omit(data, 'subForm'));

      data.subForm = JSON.parse(data.subForm);
      previewData.value = data;

      /** vxe表单赋值 */
      tableRef.value?.loadData(data.subForm as any);
    }

    loading.value = false;
  });

  const submitBtnLoading = ref(false);

  const [registerForm, { setFieldsValue, validate, setProps }] = useForm({
    labelWidth: 100,
    name: 'leave_form',
    showActionButtonGroup: false,
    baseColProps: {
      xs: 24,
      sm: 24,
      md: 24,
      lg: 24,
    },
    schemas: modalSchemas,
    // 日期选择格式化
    fieldMapToTime: [
      ['dateTime', ['startDate', 'endDate'], ['YYYY-MM-DD 00:00:00', 'YYYY-MM-DD 00:00:00']],
    ],
  });

  const tableRef = ref<VxeGridInstance>();

  const gridOptions = reactive<BasicTableProps>({
    id: 'CodeGenVxeTable',
    keepSource: true,
    border: true,
    editConfig: { trigger: 'click', mode: 'cell', showStatus: true },
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
    editRules: validRules,
  });

  async function handleInsert() {
    const $table = tableRef.value;
    if ($table) {
      const record = {
        // name: '',
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

  type SubmitType = 'temp' | 'submit';

  const { closeCurrent } = useTabs();
  const [registerModal, { openModal: openPreModal }] = useModal();

  const { createMessage } = useMessage();
  async function handleSubmit(submitType: SubmitType) {
    try {
      submitBtnLoading.value = true;
      // 校验表单
      const data = await validate();
      // 校验子表单
      const subData = await handleTableValidate();
      if (subData && subData.length === 0) {
        createMessage.warn('子表单不能为空');
        return;
      }
      const api = leaveOptions.type === 'update' ? purchaseUpdate : purchaseAdd;
      /** 这里是偷懒 后端应该用子表的 */
      data.subForm = JSON.stringify(subData);
      // 拿到response
      const ret = await api(data);
      // 暂存
      if (submitType === 'temp') {
        await closeCurrent();
        return;
      }
      // startWorkFlow
      const startWorkFlowParam = {
        businessKey: ret.id,
        tableName: 'test_purchase',
        // 对应的流程key
        // processKey: data.version,
        variables: {
          entity: ret, // 这里是上个api的返回结果
          // leaveDays: ret.leaveDays,
          userList: [1, 3], // 先写死 不知道这个什么东西
          userList2: [1, 3], // 先写死 不知道这个什么东西
        },
      };
      console.log(startWorkFlowParam);
      // 拿到taskId
      const startResp = await startWorkFlow(startWorkFlowParam);
      // 打开提交前modal
      openPreModal(true, startResp.taskId);
    } catch (e) {
      console.warn(e);
    } finally {
      submitBtnLoading.value = false;
    }
  }

  async function handleReload() {
    await closeCurrent();
  }
</script>
