<template>
  <PageWrapper dense contentClass="p-16px">
    <CollapseContainer title="表单信息">
      <Skeleton active v-show="loading" />
      <BasicForm v-show="!loading && isEdit" @register="registerForm" />
      <Preview v-if="previewData && isPreview" :data="previewData" />
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
  import { modalSchemas } from './leave.data';
  import { PageWrapper } from '@/components/Page';
  import { onMounted, computed, ref } from 'vue';
  import { add, update, getInfo } from './api';
  import { omit } from 'lodash-es';
  import { useTabs } from '@/hooks/web/useTabs';
  import PreSubmitModal from '@/views/workflow/components/PreSubmitModal/index.vue';
  import { useModal } from '@/components/Modal';
  import { startWorkFlow } from '@/api/workflow/task';
  import WorkFlowPreview from '@/views/workflow/components/WorkFlowPreview/index.vue';
  import { CollapseContainer } from '@/components/Container';
  import ApprovalContent from '@/views/workflow/components/ApprovalContent/index.vue';
  import { dateUtil } from '@/utils/dateUtil';
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
      const ret = await getInfo(id);
      previewBusinessKey.value = ret.id;
      /** 预览 */
      previewData.value = ret;
      /**
       * 2024年5月25日  升级vben版本后 必须使用dayJs类型
       * 否则会报错 date1.isAfter is not a function
       */
      ret.dateTime = [dateUtil(ret.startDate), dateUtil(ret.endDate)];
      await setFieldsValue(ret);
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
      lg: 12,
    },
    schemas: modalSchemas,
    // 日期选择格式化
    fieldMapToTime: [
      ['dateTime', ['startDate', 'endDate'], ['YYYY-MM-DD 00:00:00', 'YYYY-MM-DD 00:00:00']],
    ],
  });

  type SubmitType = 'temp' | 'submit';

  const { closeCurrent } = useTabs();
  const [registerModal, { openModal: openPreModal }] = useModal();

  async function handleSubmit(submitType: SubmitType) {
    try {
      submitBtnLoading.value = true;
      const data = await validate();
      const excludeData = omit(data, 'version');
      const api = leaveOptions.type === 'update' ? update : add;
      // 拿到response
      const ret = await api(excludeData);
      // 暂存
      if (submitType === 'temp') {
        await closeCurrent();
        return;
      }
      // startWorkFlow
      const startWorkFlowParam = {
        businessKey: ret.id,
        tableName: 'test_leave',
        // 对应的流程key
        // processKey: data.version,
        variables: {
          entity: ret, // 这里是上个api的返回结果
          leaveDays: ret.leaveDays,
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

<style lang="less">
  /**
  antdv的样式有问题 anddr的样式是正常的
  */
  .ant-input-number-disabled .ant-input-number-input {
    color: inherit;
  }
</style>
