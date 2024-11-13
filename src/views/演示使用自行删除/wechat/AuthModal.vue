<template>
  <BasicModal
    v-bind="$attrs"
    title="授权码"
    :min-height="350"
    @register="registerInnerModal"
    @ok="handleSubmit"
    @cancel="resetForm"
  >
    <BasicForm class="mt-5" @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { BasicForm, useForm } from '@/components/Form';
  import { useLocalStorage } from '@vueuse/core';
  import { useMessage } from '@/hooks/web/useMessage';

  defineOptions({ name: 'AuthModal' });

  const [registerInnerModal, { modalLoading, closeModal }] = useModalInner();

  const authPassword = useLocalStorage('authPassword', '');
  const [registerForm, { validate, resetForm }] = useForm({
    labelWidth: 80,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
    schemas: [
      {
        label: '授权码',
        field: 'password',
        component: 'Input',
        required: true,
        colProps: {
          span: 24,
        },
      },
    ],
  });

  const { createMessage } = useMessage();
  async function handleSubmit() {
    try {
      modalLoading(true);
      const { password } = await validate();
      authPassword.value = password;
      await resetForm();
      createMessage.info({ content: '已更新授权码' });
      closeModal();
    } catch (e) {
      console.warn(e);
    } finally {
      modalLoading(false);
    }
  }
</script>

<style scoped></style>
