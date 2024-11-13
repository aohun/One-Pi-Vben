<template>
  <BasicModal
    v-bind="$attrs"
    title="驳回"
    :width="600"
    :can-fullscreen="false"
    @register="registerModalInner"
    @cancel="handleCancel"
  >
    <BasicForm @register="registerForm" />
    <template #footer>
      <a-button @click="handleCancel">取消</a-button>
      <Popconfirm
        placement="topRight"
        title="确认驳回吗?"
        ok-text="确认"
        cancel-text="再想想"
        @confirm="handleSubmit"
      >
        <a-button type="primary" danger>驳回</a-button>
      </Popconfirm>
    </template>
  </BasicModal>
</template>

<script setup lang="ts">
  import { useModalInner, BasicModal } from '@/components/Modal';
  import { BasicForm, useForm } from '@/components/Form';
  import { backProcess, getTaskNodeList } from '@/api/workflow/task';
  import { Popconfirm } from 'ant-design-vue';
  import { rejectModalSchemas } from './data';
  import { useMessage } from '@/hooks/web/useMessage';

  const emit = defineEmits(['register', 'reload']);

  const [registerModalInner, { modalLoading, closeModal }] = useModalInner(openModalCallback);
  async function openModalCallback(data: { taskId: string; processInstanceId: string }) {
    modalLoading(true);

    const { taskId, processInstanceId } = data;
    const resp = await getTaskNodeList(processInstanceId);
    const targetActivityOptions = resp.map((item) => ({
      label: item.nodeName,
      value: item.nodeId,
    }));

    await updateSchema({
      field: 'targetActivityId',
      componentProps: {
        options: targetActivityOptions,
      },
    });

    await setFieldsValue({ taskId });

    modalLoading(false);
  }

  const [registerForm, { validate, resetForm, setFieldsValue, updateSchema }] = useForm({
    labelWidth: 100,
    name: 'reject_modal',
    showActionButtonGroup: false,
    schemas: rejectModalSchemas,
    baseColProps: { span: 24 },
  });

  async function handleCancel() {
    closeModal();
    await resetForm();
  }

  const { createMessage } = useMessage();
  async function handleSubmit() {
    try {
      modalLoading(true);
      const data = await validate();
      await backProcess(data);
      createMessage.success('操作成功');
      emit('reload');
      closeModal();
      resetForm();
    } catch (e) {
      console.warn(e);
    } finally {
      modalLoading(false);
    }
  }
</script>

<style scoped></style>
