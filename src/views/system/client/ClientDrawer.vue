<template>
  <BasicDrawer
    v-bind="$attrs"
    :title="title"
    :width="drawerWidth"
    :showFooter="true"
    @register="registerInnerModal"
    @ok="handleSubmit"
    @close="resetForm"
  >
    <BasicForm @register="registerForm">
      <template #clientSecret="{ model, field }">
        <SecretInput v-model:value="model[field]" :disabled="isUpdate" />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>

<script setup lang="ts">
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { BasicForm, useForm } from '@/components/Form';
  import { computed, ref, unref } from 'vue';
  import { clientAdd, clientUpdate, clientInfo } from '@/api/system/client';
  import { modalSchemas } from './client.data';
  import { useMaxWidthOrDefault } from '@/hooks/web/useSize';
  import SecretInput from './SecretInput.vue';

  defineOptions({ name: 'ClientDrawer' });

  const emit = defineEmits(['register', 'reload']);

  const isUpdate = ref<boolean>(false);
  const drawerWidth = useMaxWidthOrDefault(700);
  const title = computed<string>(() => {
    return isUpdate.value ? '编辑客户端' : '新增客户端';
  });

  const [registerInnerModal, { drawerLoading, closeDrawer }] = useDrawerInner(
    async (data: { record?: Recordable; update: boolean }) => {
      drawerLoading(true);

      const { record, update } = data;
      isUpdate.value = update;

      await updateSchema([
        { field: 'clientId', show: update },
        { field: 'clientKey', componentProps: { disabled: update } },
        { field: 'clientSecret', componentProps: { disabled: update } },
        /** id为1(PC) 状态不可设置为停用 停用后登录提示: 认证权限类型已禁用 */
        {
          field: 'status',
          componentProps: {
            disabled: record?.id === 1,
          },
        },
      ]);

      if (update && record) {
        const ret = await clientInfo(record.id);
        await setFieldsValue(ret);
      }

      drawerLoading(false);
    },
  );

  const [registerForm, { setFieldsValue, resetForm, validate, updateSchema }] = useForm({
    layout: 'vertical',
    labelWidth: 180,
    name: 'client_modal',
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
    schemas: modalSchemas,
  });

  async function handleSubmit() {
    try {
      drawerLoading(true);
      const data = await validate();
      data.grantType = data.grantTypeList.join(',');
      if (unref(isUpdate)) {
        await clientUpdate(data);
      } else {
        await clientAdd(data);
      }
      emit('reload');
      closeDrawer();
      await resetForm();
    } catch (e) {
      console.warn(e);
    } finally {
      drawerLoading(false);
    }
  }
</script>

<style scoped></style>
