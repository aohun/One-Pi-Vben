<template>
  <BasicModal
    v-bind="$attrs"
    title="表单配置"
    :width="600"
    :can-fullscreen="false"
    @register="registerModalInner"
    @ok="handleSubmit"
    @cancel="resetForm"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { BasicForm, useForm } from '@/components/Form';
  import {
    getInfoById,
    saveOrUpdate,
    getByTableNameNotDefId,
  } from '@/api/workflow/definitionConfig';
  import { useMessage } from '@/hooks/web/useMessage';

  const emit = defineEmits(['register', 'reload']);

  const [registerModalInner, { modalLoading, closeModal }] = useModalInner(openModalCallback);

  async function openModalCallback(record: Recordable) {
    const { key, id } = record;
    const data = {
      processKey: key,
      definitionId: id,
      version: record.version,
    };
    const ret = await getInfoById(id);
    if (ret) {
      await setFieldsValue(ret);
    } else {
      await setFieldsValue(data);
    }
  }

  const [registerForm, { setFieldsValue, validate, resetForm }] = useForm({
    baseColProps: { span: 24 },
    labelWidth: 100,
    layout: 'vertical',
    name: 'form_config_form',
    showActionButtonGroup: false,
    schemas: [
      {
        label: '表单id',
        field: 'id',
        component: 'Input',
        show: false,
      },
      {
        label: '定义ID',
        field: 'definitionId',
        component: 'Input',
        show: false,
      },
      {
        label: '版本',
        field: 'version',
        component: 'Input',
        show: false,
      },
      {
        label: '流程key',
        field: 'processKey',
        component: 'Input',
        componentProps: {
          disabled: true,
        },
      },
      {
        label: '表名',
        field: 'tableName',
        component: 'Input',
      },
      {
        label: '备注',
        field: 'remark',
        component: 'InputTextArea',
      },
    ],
  });

  const { createConfirm } = useMessage();
  async function handleSubmit() {
    try {
      modalLoading(true);
      const data = await validate();
      /** 查询是否已经绑定了 */
      const resp = await getByTableNameNotDefId(data.tableName, data.definitionId);
      if (resp.length > 0) {
        const current = resp[0];
        createConfirm({
          title: '提示',
          iconType: 'warning',
          content: `表名已被[${current.processKey}] v${current.version} 绑定, 确认后会被替换`,
          async onOk() {
            await saveOrUpdate(data);
            emit('reload');
            closeModal();
            await resetForm();
          },
          async onCancel() {
            closeModal();
            await resetForm();
          },
        });
      } else {
        await saveOrUpdate(data);
        emit('reload');
        closeModal();
        await resetForm();
      }
    } catch (e) {
      console.warn(e);
    } finally {
      modalLoading(false);
    }
  }
</script>

<style scoped></style>
