<template>
  <BasicModal
    v-bind="$attrs"
    :title="title"
    @register="registerInnerModal"
    @ok="handleSubmit"
    @cancel="resetForm"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { BasicForm, useForm } from '@/components/Form';
  import { computed, ref, unref } from 'vue';
  import { wfFormManageAdd, wfFormManageUpdate, wfFormManageInfo } from '@/api/workflow/formManage';
  import { modalSchemas } from './formManage.data';
  import { useRouter } from 'vue-router';
  import { useMessage } from '@/hooks/web/useMessage';

  defineOptions({ name: 'FormManageModal' });

  const emit = defineEmits(['register', 'reload']);

  const isUpdate = ref<boolean>(false);
  const title = computed<string>(() => {
    return isUpdate.value ? '编辑表单' : '新增表单';
  });

  const [registerInnerModal, { modalLoading, closeModal }] = useModalInner(
    async (data: { record?: Recordable; update: boolean }) => {
      modalLoading(true);
      const { record, update } = data;
      isUpdate.value = update;
      if (update && record) {
        const ret = await wfFormManageInfo(record.id);
        await setFieldsValue(ret);
      }
      modalLoading(false);
    },
  );

  const [registerForm, { setFieldsValue, resetForm, validate }] = useForm({
    labelWidth: 100,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
    schemas: modalSchemas,
  });

  const router = useRouter();
  function isExistRoute(path: string) {
    const routes = router.getRoutes();
    return routes.find((item) => item.path === path);
  }

  const { createMessage } = useMessage();
  async function handleSubmit() {
    try {
      modalLoading(true);
      const data = await validate();
      /** 判断路由是否存在 */
      if (data.formType === 'static') {
        const isExist = isExistRoute(data.router);
        if (!isExist) {
          createMessage.error({ content: '路由地址不存在, 添加后重试!' });
          return;
        }
      }
      /** 提交 */
      if (unref(isUpdate)) {
        await wfFormManageUpdate(data);
      } else {
        await wfFormManageAdd(data);
      }
      emit('reload');
      closeModal();
      await resetForm();
    } catch (e) {
      console.warn(e);
    } finally {
      modalLoading(false);
    }
  }
</script>

<style scoped></style>
