<template>
  <BasicModal
    v-bind="$attrs"
    :title="title"
    :width="600"
    @register="registerModal"
    @ok="handleSubmit"
    @cancel="resetForm"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { ref, unref, computed } from 'vue';
  import { BasicForm, useForm } from '@/components/Form';
  import { modalSchemas } from './tenant.data';
  import { tenantAdd, tenantUpdate, tenantInfo } from '@/api/system/tenant';
  import { packageSelectList } from '@/api/system/tenantPackage';
  import { useTenantStore } from '@/store/modules/tenant';

  defineOptions({ name: 'TenantModal' });
  const emit = defineEmits(['register', 'reload']);
  const isUpdate = ref<boolean>(false);
  const title = computed(() => {
    return isUpdate.value ? '编辑租户' : '新增租户';
  });

  const [registerModal, { closeModal, modalLoading }] = useModalInner(
    async (data: { record?: Recordable; update: boolean }) => {
      modalLoading(true);

      const { record, update } = data;
      isUpdate.value = update;
      if (update && record) {
        const ret = await tenantInfo(record.id);
        await setFieldsValue(ret);
      }
      // 租户套餐选择  每次打开modal请求一次 保证为最新的
      await initOptions();

      modalLoading(false);
    },
  );

  async function initOptions() {
    const options = await packageSelectList();
    await updateSchema({
      field: 'packageId',
      componentProps: {
        fieldNames: {
          label: 'packageName',
          value: 'packageId',
        },
        options,
        disabled: isUpdate.value,
      },
    });
  }

  const [registerForm, { setFieldsValue, validate, resetForm, updateSchema }] = useForm({
    labelWidth: 80,
    name: 'tenant_modal',
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
    schemas: modalSchemas,
  });

  const { initTenant } = useTenantStore();
  async function handleSubmit() {
    try {
      modalLoading(true);
      const data = await validate();
      if (unref(isUpdate)) {
        await tenantUpdate(data);
      } else {
        await tenantAdd(data);
      }
      await initTenant();
      resetForm();
      emit('reload', closeModal);
    } catch (e) {
      console.log(e);
    } finally {
      modalLoading(false);
    }
  }
</script>

<style scoped></style>
