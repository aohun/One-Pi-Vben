<template>
  <BasicModal
    v-bind="$attrs"
    :title="title"
    :width="600"
    :min-height="350"
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
  import { categoryList, categoryInfo, categoryAdd, categoryUpdate } from '@/api/workflow/category';
  import { modalSchemas } from './category.data';
  import { listToTree, addFullName } from '@/utils/helper/treeHelper';

  defineOptions({ name: 'CategoryModal' });
  const emits = defineEmits(['register', 'reload']);

  const isUpdate = ref<boolean>(false);
  const title = computed<string>(() => {
    return isUpdate.value ? '编辑' : '新增';
  });

  const [registerInnerModal, { modalLoading, closeModal }] = useModalInner(openModalCallback);
  async function openModalCallback(data: { id?: string | number; update: boolean }) {
    modalLoading(true);

    const { id, update } = data;
    isUpdate.value = update;
    if (update && id) {
      const ret = await categoryInfo(id);
      await setFieldsValue(ret);
    } else {
      await setFieldsValue({ parentId: id ?? 0 });
    }
    await initTreeSelect();

    modalLoading(false);
  }

  async function initTreeSelect() {
    const ret = await categoryList();
    let treeData = listToTree(ret, { id: 'id', pid: 'parentId' });
    treeData = [
      {
        categoryName: '根目录',
        id: 0,
        children: treeData,
      },
    ];
    // 添加名称 如 xx-xx-xx
    addFullName(treeData, 'categoryName', ' / ');
    await updateSchema({
      field: 'parentId',
      componentProps: {
        treeData,
        treeLine: { showLeafIcon: false },
        fieldNames: { label: 'categoryName', value: 'id' },
        treeDefaultExpandAll: true,
        // 选中后显示在输入框的值
        treeNodeLabelProp: 'fullName',
      },
    });
  }

  const [registerForm, { updateSchema, setFieldsValue, resetForm, validate }] = useForm({
    labelWidth: 100,
    name: 'category_modal',
    showActionButtonGroup: false,
    schemas: modalSchemas,
    baseColProps: { span: 24 },
  });

  async function handleSubmit() {
    try {
      modalLoading(true);
      const data = await validate();
      if (unref(isUpdate)) {
        await categoryUpdate(data);
      } else {
        await categoryAdd(data);
      }
      emits('reload');
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
