<template>
  <BasicDrawer
    v-bind="$attrs"
    :title="title"
    :width="drawerWidth"
    showFooter
    @register="registerModal"
    @ok="handleSubmit"
    @close="resetForm"
  >
    <BasicForm @register="registerForm">
      <template #packageSelect="{ model, field }">
        <Select
          v-model:value="model[field]"
          placeholder="请选择租户套餐"
          :disabled="isUpdate"
          allowClear
        >
          <SelectOption v-for="(item, index) in packageList" :key="index" :value="item.packageId">
            <div class="flex flex-row items-center gap-1">
              <span v-text="item.packageName"></span>
              <Tag color="blue"> 菜单项目数: {{ (item.menuIds as string).split(', ').length }}</Tag>
              <Tag v-if="item.remark" color="orange">{{ item.remark }}</Tag>
            </div>
          </SelectOption>
        </Select>
      </template>
    </BasicForm>
  </BasicDrawer>
</template>

<script setup lang="ts">
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { ref, unref, computed } from 'vue';
  import { BasicForm, useForm } from '@/components/Form';
  import { drawerSchemas } from './tenant.drawer.data';
  import { tenantAdd, tenantUpdate, tenantInfo } from '@/api/system/tenant';
  import { useTenantStore } from '@/store/modules/tenant';
  import { Select, Tag } from 'ant-design-vue';
  import type { TenantPackage } from '@/api/system/tenantPackage/model';
  import { useMaxWidthOrDefault } from '@/hooks/web/useSize';

  const SelectOption = Select.Option;

  defineOptions({ name: 'TenantDrawer' });

  const emit = defineEmits(['register', 'reload']);
  const isUpdate = ref<boolean>(false);

  const title = computed(() => {
    return isUpdate.value ? '编辑租户' : '新增租户';
  });

  const drawerWidth = useMaxWidthOrDefault(700);

  const [registerModal, { closeDrawer, drawerLoading }] = useDrawerInner(
    async (data: { record?: Recordable; update: boolean; tenantPackageList: TenantPackage[] }) => {
      drawerLoading(true);
      const { record, update, tenantPackageList } = data;
      isUpdate.value = update;

      if (update && record) {
        const ret = await tenantInfo(record.id);
        await setFieldsValue(ret);
      }

      // 租户套餐选择  改为从index传入
      packageList.value = tenantPackageList;
      drawerLoading(false);
    },
  );

  const packageList = ref<TenantPackage[]>([]);

  const [registerForm, { setFieldsValue, validate, resetForm }] = useForm({
    labelWidth: 100,
    name: 'tenant_drawer',
    showActionButtonGroup: false,
    showAdvancedButton: false,
    baseColProps: { span: 24 },
    schemas: drawerSchemas,
  });

  const { initTenant } = useTenantStore();
  async function handleSubmit() {
    try {
      drawerLoading(true);
      const data = await validate();
      if (unref(isUpdate)) {
        await tenantUpdate(data);
      } else {
        await tenantAdd(data);
      }
      await initTenant();
      emit('reload');
      closeDrawer();
      await resetForm();
    } catch (e) {
      console.log(e);
    } finally {
      drawerLoading(false);
    }
  }
</script>

<style lang="less" scoped>
  // 重置样式 使默认的有问题
  :deep(.ant-tag) {
    display: flex;
    align-items: center;
    margin: 2px;
    margin-inline-end: 0;
  }
</style>
