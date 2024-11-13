<template>
  <BasicModal
    v-bind="$attrs"
    title="作废"
    :width="600"
    @register="registerModalInner"
    @ok="handleSubmit"
    @cancel="handleReset"
  >
    <BasicForm @register="registerForm" />
    <template #footer>
      <a-button @click="handleReset">取消</a-button>
      <Popconfirm title="是否确认作废?" ok-text="确认" cancel-text="再想想" @confirm="handleSubmit">
        <a-button :disabled="submitBtnDisabled" type="primary">确认</a-button>
      </Popconfirm>
    </template>
  </BasicModal>
</template>

<script setup lang="ts">
  import { useModalInner, BasicModal } from '@/components/Modal';
  import { BasicForm, useForm } from '@/components/Form';
  import { deleteRunInstance } from '@/api/workflow/processInstance';
  import { ref, unref } from 'vue';
  import { Popconfirm } from 'ant-design-vue';

  defineOptions({ name: 'CancelModal' });

  const emit = defineEmits(['register', 'reload']);

  const currentBusinessKey = ref<string>('');
  const [registerModalInner, { modalLoading, closeModal }] = useModalInner(
    (businessKey: string) => {
      currentBusinessKey.value = businessKey;
    },
  );

  const submitBtnDisabled = ref(true);
  const [registerForm, { validate, resetForm }] = useForm({
    name: 'cancel-form',
    layout: 'vertical',
    labelWidth: 120,
    schemas: [
      {
        label: '作废原因',
        field: 'deleteReason',
        component: 'InputTextArea',
        componentProps() {
          return {
            placeholder: '请输入作废原因',
            rows: 5,
            onChange(e) {
              submitBtnDisabled.value = e.target.value ? false : true;
            },
          };
        },
        rules: [
          {
            required: true,
            message: '请输入作废原因',
            trigger: ['change', 'blur'],
          },
        ],
      },
    ],
    showActionButtonGroup: false,
    baseColProps: {
      span: 24,
    },
  });

  async function handleSubmit() {
    try {
      modalLoading(true);
      const data = await validate();
      // 添加上实例ID
      data.businessKey = unref(currentBusinessKey);
      // 提交
      await deleteRunInstance(data as any);
      emit('reload');
      closeModal();
      await handleReset();
    } catch (e) {
      console.log(e);
    } finally {
      modalLoading(false);
    }
  }

  async function handleReset() {
    await resetForm();
    currentBusinessKey.value = '';
    submitBtnDisabled.value = true;
    closeModal();
  }
</script>

<style scoped></style>
