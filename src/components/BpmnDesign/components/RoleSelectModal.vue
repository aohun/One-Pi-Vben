<template>
  <BasicModal
    v-bind="$attrs"
    title="选择组"
    :canFullscreen="false"
    :width="600"
    @ok="handleOk"
    @register="registerModalInner"
  >
    <Transfer
      v-model:target-keys="targetKeys"
      v-model:selected-keys="selectedKeys"
      :titles="['列表', '已选中']"
      :operations="['选中', '取消']"
      :data-source="transferDataSource"
      :render="(item) => item.title"
      :list-style
      show-search
    />
  </BasicModal>
</template>

<script setup lang="ts">
  import { Transfer } from 'ant-design-vue';
  import { roleOptionSelect } from '@/api/system/role';
  import { CSSProperties, ref } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';

  defineOptions({ name: 'RoleSelectModal' });

  const emit = defineEmits(['register', 'selectDone']);
  /** 数据源 */
  const transferDataSource = ref<Recordable[]>();
  /** 左边选中 */
  const selectedKeys = ref<string[]>([]);
  /** 右边选中 */
  const targetKeys = ref<string[]>([]);
  /** 样式 */
  const listStyle = ref<CSSProperties>({
    width: '250px',
    height: '300px',
  });

  const [registerModalInner, { modalLoading, closeModal }] = useModalInner(init);
  async function init({ roleIds }: { roleIds: string }) {
    modalLoading(true);

    if (roleIds) {
      const idList = roleIds.split(',').map(String);
      // 设置选中
      targetKeys.value = idList;
    }
    const roleOptions: Recordable[] = await roleOptionSelect();
    // 设置dataSource
    transferDataSource.value = roleOptions.map((item) => ({
      key: String(item.roleId),
      title: item.roleName,
    }));

    modalLoading(false);
  }

  function handleOk() {
    emit('selectDone', targetKeys.value);
    closeModal();
  }
</script>

<style scoped></style>
