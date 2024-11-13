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
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>

<script setup lang="ts">
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { BasicForm, useForm } from '@/components/Form';
  import { computed, ref, unref } from 'vue';
  import { ossConfigInfo, ossConfigAdd, ossConfigUpdate } from '@/api/system/oss/config';
  import { drawerSchemas } from './oss.config.drawer';
  import { useMaxWidthOrDefault } from '@/hooks/web/useSize';

  defineOptions({ name: 'OssConfigDrawer' });

  const emit = defineEmits(['register', 'reload']);

  const isUpdate = ref<boolean>(false);
  const drawerWidth = useMaxWidthOrDefault(700);
  const title = computed<string>(() => {
    return isUpdate.value ? '编辑OSS配置' : '新增OSS配置';
  });

  const [registerInnerModal, { drawerLoading, closeDrawer }] = useDrawerInner(
    async (data: { record?: Recordable; update: boolean }) => {
      drawerLoading(true);
      const { record, update } = data;
      isUpdate.value = update;
      if (update && record) {
        const ret = await ossConfigInfo(record.ossConfigId);
        await setFieldsValue(ret);
      }
      drawerLoading(false);
    },
  );

  const [registerForm, { setFieldsValue, resetForm, validate }] = useForm({
    labelWidth: 100,
    name: 'oss_config_drawer',
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
    schemas: drawerSchemas,
  });

  async function handleSubmit() {
    try {
      drawerLoading(true);
      const data = await validate();
      if (unref(isUpdate)) {
        await ossConfigUpdate(data);
      } else {
        await ossConfigAdd(data);
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
