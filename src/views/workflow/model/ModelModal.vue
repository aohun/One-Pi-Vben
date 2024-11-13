<template>
  <BasicModal
    v-bind="$attrs"
    :title="title"
    :width="600"
    :min-height="350"
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
  import { modalSchemas } from './model.data';
  import { flowModelUpdate, flowModelSave, flowModelInfo } from '@/api/workflow/model';
  import { categoryList } from '@/api/workflow/category';
  import { listToTree, addFullName } from '@/utils/helper/treeHelper';
  import { computed, ref, unref } from 'vue';
  import { generateDefaultXml } from '@/views/workflow/defaultXml';

  defineOptions({ name: 'ModelModal' });
  const emits = defineEmits(['register', 'reload']);

  const isUpdate = ref<boolean>(false);
  const title = computed<string>(() => {
    return isUpdate.value ? '编辑模型' : '新增模型';
  });

  const [registerModalInner, { modalLoading, closeModal }] = useModalInner(
    async (data: { id: string; update: boolean }) => {
      const { id, update } = data;
      isUpdate.value = update;
      if (update) {
        const ret = await flowModelInfo(id);
        await setFormDisabled(true);
        await setFieldsValue(ret);
      } else {
        await setFormDisabled(false);
      }
      await initTreeSelect();
    },
  );

  async function setFormDisabled(disabled: boolean) {
    await updateSchema([
      {
        field: 'name',
        componentProps: {
          disabled,
        },
      },
      {
        field: 'key',
        componentProps: {
          disabled,
        },
      },
    ]);
  }

  async function initTreeSelect() {
    const ret = await categoryList();
    let treeData = listToTree(ret, { id: 'id', pid: 'parentId' });
    treeData = [
      {
        categoryName: '根目录',
        categoryCode: 'ALL',
        id: 0,
        children: treeData,
      },
    ];
    // 添加名称 如 xx-xx-xx
    addFullName(treeData, 'categoryName', ' / ');
    await updateSchema({
      field: 'categoryCode',
      componentProps: {
        treeData,
        treeLine: { showLeafIcon: false },
        // 注意这里为categoryCode
        fieldNames: { label: 'categoryName', value: 'categoryCode' },
        treeDefaultExpandAll: true,
        // 选中后显示在输入框的值
        treeNodeLabelProp: 'fullName',
      },
    });
  }

  const [registerForm, { resetForm, validate, updateSchema, setFieldsValue }] = useForm({
    labelWidth: 100,
    name: 'model_modal',
    showActionButtonGroup: false,
    schemas: modalSchemas,
    baseColProps: { span: 24 },
  });

  async function handleSubmit() {
    try {
      modalLoading(true);
      const data = await validate();
      if (unref(isUpdate)) {
        await flowModelUpdate(data);
      } else {
        // 需要添加默认xml
        data.xml = generateDefaultXml(data.name, data.key);
        await flowModelSave(data);
      }
      emits('reload');
      closeModal();
      await resetForm();
    } catch (e) {
      console.log(e);
    } finally {
      modalLoading(false);
    }
  }
</script>

<style scoped></style>
