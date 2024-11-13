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
  import { treeInfo, treeAdd, treeUpdate, treeList } from './api';
  import { modalSchemas } from './tree.data';
  import { listToTree } from '@/utils/helper/treeHelper';

  defineOptions({ name: 'TreeModal' });

  const emit = defineEmits(['register', 'reload']);

  const isUpdate = ref<boolean>(false);
  const title = computed<string>(() => {
    return isUpdate.value ? '编辑测试树' : '新增测试树';
  });

  const [registerInnerModal, { modalLoading, closeModal }] = useModalInner(
    async (data: { record?: Recordable; update: boolean }) => {
      modalLoading(true);
      const { record, update } = data;
      isUpdate.value = update;
      if (update && record) {
        const ret = await treeInfo(record.id);
        await setFieldsValue(ret);
      }
      // 下拉框初始化
      await initTreeSelect();
      modalLoading(false);
    },
  );

  async function initTreeSelect() {
    // 需要动态更新TreeSelect组件 这里允许为空
    const listData = await treeList();
    const treeData = listToTree(listData, { id: 'id', pid: 'parentId' });
    await updateSchema({
      field: 'parentId',
      componentProps: {
        treeData,
        treeLine: { showLeafIcon: false },
        fieldNames: { label: 'treeName', value: 'treeId' },
        treeDefaultExpandAll: true,
      },
    });
  }

  const [registerForm, { setFieldsValue, resetForm, validate, updateSchema }] = useForm({
    labelWidth: 100,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
    schemas: modalSchemas,
  });

  async function handleSubmit() {
    try {
      modalLoading(true);
      const data = await validate();
      if (unref(isUpdate)) {
        await treeUpdate(data);
      } else {
        await treeAdd(data);
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
