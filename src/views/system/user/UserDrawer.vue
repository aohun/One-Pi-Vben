<template>
  <BasicDrawer
    v-bind="$attrs"
    :width="drawerWidth"
    :title="title"
    :show-footer="true"
    @register="registerInnerDrawer"
    @ok="handleSubmit"
    @close="handleCancel"
  >
    <BasicForm @register="registerForm">
      <template #postIds="{ model, field }">
        <!-- optionLabelProp为回填到输入框中的属性 -->
        <!-- optionFilterProp为搜索的属性 -->
        <Select
          :get-popup-container="getPopupContainer"
          v-model:value="model[field]"
          optionFilterProp="title"
          :placeholder="postPlaceholder"
          mode="multiple"
          optionLabelProp="title"
        >
          <SelectOption
            v-for="item in postList"
            :key="item.postId"
            :value="item.postId"
            :title="item.postName"
          >
            <div class="flex flex-row gap-1.5">
              <span>{{ item.postName }}</span>
              <Tag>{{ item.postCode }}</Tag>
            </div>
          </SelectOption>
        </Select>
      </template>
      <template #roleIds="{ model, field }">
        <Select
          :get-popup-container="getPopupContainer"
          v-model:value="model[field]"
          optionFilterProp="title"
          placeholder="请选择角色"
          mode="multiple"
          optionLabelProp="title"
        >
          <SelectOption
            v-for="item in roleList"
            :key="item.roleId"
            :value="item.roleId"
            :title="item.roleName"
          >
            <div class="flex flex-row gap-1.5">
              <span>{{ item.roleName }}</span>
              <Tag :color="getRoleAuthOption(item.dataScope)?.color">{{
                getRoleAuthOption(item.dataScope)?.label
              }}</Tag>
            </div>
          </SelectOption>
        </Select>
      </template>
    </BasicForm>
  </BasicDrawer>
</template>

<script setup lang="ts">
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { BasicForm, useForm } from '@/components/Form';
  import { computed, ref, unref } from 'vue';
  import { userAdd, userUpdate, userInfo, departmentTree } from '@/api/system/user';
  import { postOptionSelect } from '@/api/system/post';
  import { drawerSchemas } from './user.data';
  import { addFullName } from '@/utils/helper/treeHelper';
  import { useMaxWidthOrDefault } from '@/hooks/web/useSize';
  import { Select, Tag } from 'ant-design-vue';
  import { Role, Post } from '@/api/system/user/model';
  import { authScopeOptions } from '@/views/system/role/role.data';
  import { getPopupContainer } from '@/utils';

  const SelectOption = Select.Option;

  defineOptions({ name: 'UserDrawer' });

  const emit = defineEmits(['register', 'reload']);

  const isUpdate = ref<boolean>(false);
  const drawerWidth = useMaxWidthOrDefault(700);
  const title = computed<string>(() => {
    return isUpdate.value ? '编辑用户' : '新增用户';
  });

  /** 岗位select 自定义下拉框 */
  const postList = ref<Post[]>([]);
  const postPlaceholder = ref('选择部门后显示岗位');
  /** 角色select 自定义下拉框 */
  const roleList = ref<Role[]>([]);

  const [registerInnerDrawer, { drawerLoading, closeDrawer }] = useDrawerInner(
    async (data: { record?: Recordable; update: boolean }) => {
      drawerLoading(true);
      const { record, update } = data;
      isUpdate.value = update;
      // 在这里更新主要是打开编辑/新增 会有一个明显的隐藏/显示效果 不美观
      await updateSchema([
        {
          field: 'userName',
          componentProps: {
            disabled: update,
          },
        },
        {
          field: 'password',
          ifShow: !update,
        },
      ]);
      const response = record ? await userInfo(record.userId) : await userInfo();
      // 外部的roleIds postIds才是真正对应的  新增时为空
      const { postIds = [], roleIds = [], user, roles, posts } = response;
      // user不为空为更新
      if (user) {
        user.postIds = postIds;
        user.roleIds = roleIds;
        postList.value = posts;
      }
      // 角色下拉框
      roleList.value = roles;
      // 部门选择
      await initDeptSelect();
      // 更新信息
      if (user && update) {
        await setFieldsValue(user);
      }
      drawerLoading(false);
    },
  );

  /**
   * 初始化部门选择
   */
  async function initDeptSelect() {
    // updateSchema
    const deptTree = await departmentTree();
    // 选中后显示在输入框的值 即父节点 / 子节点
    addFullName(deptTree, 'label', ' / ');
    await updateSchema([
      {
        field: 'deptId',
        componentProps: ({ formModel }) => ({
          treeData: deptTree,
          fieldNames: { value: 'id', label: 'label' },
          treeDefaultExpandAll: true,
          treeLine: { showLeafIcon: false },
          // 选中后显示在输入框的值
          treeNodeLabelProp: 'fullName',
          async onSelect(deptId: string | number) {
            /** 根据部门ID加载岗位 */
            const postListResp = await postOptionSelect(deptId);
            if (postListResp.length > 0) {
              postPlaceholder.value = '请选择岗位';
            } else {
              postPlaceholder.value = '该部门下暂无岗位';
            }
            postList.value = postListResp;
            /** 变化后需要重新选择岗位 */
            formModel.postIds = [];
          },
        }),
      },
    ]);
  }

  const [registerForm, { setFieldsValue, resetForm, validate, updateSchema }] = useForm({
    // layout: 'vertical',
    labelWidth: 100,
    name: 'user-drawer',
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
    schemas: drawerSchemas,
  });

  /**
   * 获取对应的权限option
   */
  function getRoleAuthOption(id: string) {
    return authScopeOptions.find((item) => item.value === id);
  }

  async function handleSubmit() {
    try {
      drawerLoading(true);
      const data = await validate();
      if (unref(isUpdate)) {
        await userUpdate(data);
      } else {
        await userAdd(data);
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

  async function handleCancel() {
    await resetForm();
    postList.value = [];
    postPlaceholder.value = '选择部门后显示岗位';
  }
</script>

<style lang="less" scoped>
  :deep(.ant-tag) {
    margin-inline-end: 0;
  }
</style>
