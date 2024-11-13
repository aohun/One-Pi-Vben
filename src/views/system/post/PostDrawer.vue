<template>
  <BasicDrawer
    v-bind="$attrs"
    :title="title"
    :width="drawerWidth"
    :show-footer="true"
    @register="registerDrawerInner"
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
  import { postAdd, postUpdate, postInfo } from '@/api/system/post';
  import { modalSchemas } from './post.data';
  import { useMaxWidthOrDefault } from '@/hooks/web/useSize';
  import { departmentTree } from '@/api/system/user';
  import { addFullName } from '@/utils/helper/treeHelper';

  defineOptions({ name: 'PostDrawer' });

  const emit = defineEmits(['register', 'reload']);

  const drawerWidth = useMaxWidthOrDefault(600);
  const isUpdate = ref<boolean>(false);
  const title = computed<string>(() => {
    return isUpdate.value ? '编辑岗位' : '新增岗位';
  });

  const [registerDrawerInner, { drawerLoading, closeDrawer }] = useDrawerInner(openDrawerCallback);
  async function openDrawerCallback(data: { record?: Recordable; update: boolean }) {
    drawerLoading(true);
    const { record, update } = data;
    isUpdate.value = update;
    if (update && record) {
      const ret = await postInfo(record.postId);
      await setFieldsValue(ret);
    }
    // 部门选择
    await initDeptSelect();

    drawerLoading(false);
  }

  async function initDeptSelect() {
    const deptTree = await departmentTree();
    // 选中后显示在输入框的值 即父节点 / 子节点
    addFullName(deptTree, 'label', ' / ');
    await updateSchema([
      {
        field: 'deptId',
        componentProps: {
          treeData: deptTree,
          fieldNames: { value: 'id', label: 'label' },
          treeDefaultExpandAll: true,
          treeLine: { showLeafIcon: false },
          // 选中后显示在输入框的值
          treeNodeLabelProp: 'fullName',
        },
      },
    ]);
  }

  const [registerForm, { setFieldsValue, resetForm, validate, updateSchema }] = useForm({
    labelWidth: 80,
    name: 'post_modal',
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
    schemas: modalSchemas,
  });

  async function handleSubmit() {
    try {
      drawerLoading(true);
      const data = await validate();
      if (unref(isUpdate)) {
        await postUpdate(data);
      } else {
        await postAdd(data);
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
