<template>
  <BasicModal
    v-bind="$attrs"
    :title="modalTitle"
    :width="700"
    @register="registerInnerModal"
    @ok="handleSubmit"
    @cancel="resetForm"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { computed, ref, unref } from 'vue';
  import { BasicForm, useForm } from '@/components/Form';
  import { menuList, menuAdd, menuUpdate, menuInfo } from '@/api/system/menu';
  import { modalSchemas } from './menu.data';
  import { listToTree, addFullName } from '@/utils/helper/treeHelper';
  import { usePermission } from '@/hooks/web/usePermission';
  import { useLocalStorage } from '@vueuse/core';

  defineOptions({ name: 'MenuModal' });

  // 需要显式写出register 否则会有waning
  // https://doc.vvbin.cn/components/modal.html#usemodal
  const emit = defineEmits(['reload', 'register']);
  const isUpdate = ref<boolean>(false);
  const modalTitle = computed<string>(() => {
    return isUpdate.value ? '修改菜单' : '添加菜单';
  });

  const [registerForm, { validate, setFieldsValue, resetForm, updateSchema }] = useForm({
    schemas: modalSchemas,
    showActionButtonGroup: false,
    labelWidth: 100,
    name: 'menu_modal',
  });

  const [registerInnerModal, { modalLoading, closeModal }] = useModalInner(
    async (data: { record?: Recordable; update: boolean }) => {
      modalLoading(true);
      const { record, update } = data;
      isUpdate.value = update;
      if (record && record.parentId) {
        await setFieldsValue({ parentId: record.parentId });
      }
      if (update && record) {
        const ret = await menuInfo(record.menuId);
        await setFieldsValue(ret);
      }
      // 菜单选择 每次打开都会进行刷新
      await initMenuSelect();

      modalLoading(false);
    },
  );

  async function initMenuSelect() {
    // menu
    const menuArray = await menuList();
    const menuTree = listToTree(menuArray, { id: 'menuId', pid: 'parentId' });
    const fullMenuTree = [
      {
        menuName: '根目录',
        menuId: 0,
        children: menuTree,
      },
    ];
    addFullName(fullMenuTree, 'menuName', ' / ');

    await updateSchema({
      field: 'parentId',
      componentProps: {
        treeData: fullMenuTree,
        fieldNames: {
          label: 'menuName',
          value: 'menuId',
        },
        treeDefaultExpandAll: false,
        treeNodeLabelProp: 'fullName',
        treeLine: { showLeafIcon: false },
        // 默认展开的树节点
        treeDefaultExpandedKeys: [0],
        // 设置弹窗滚动高度 默认256
        listHeight: 300,
      },
    });
  }
  // 添加/更新后刷新菜单栏 不使用location.reload整页刷新
  const { refreshMenu } = usePermission();
  /** 修改后是否刷新菜单栏 */
  const refreshMenuRef = useLocalStorage('refreshMenu', true);

  async function handleSubmit() {
    try {
      modalLoading(true);
      const data = await validate();
      if (unref(isUpdate)) {
        await menuUpdate(data);
      } else {
        await menuAdd(data);
      }
      await resetForm();
      emit('reload', async () => {
        closeModal();
        if (refreshMenuRef.value) {
          await refreshMenu();
        }
      });
    } catch (e) {
      console.warn(e);
    } finally {
      modalLoading(false);
    }
  }
</script>

<style scoped></style>
