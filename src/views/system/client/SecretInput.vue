<template>
  <Input :disabled="disabled" placeholder="请输入密钥或随机生成" v-model:value="value">
    <template v-if="!disabled" #addonAfter>
      <a-button :pre-icon="IconEnum.REFRESH" type="primary" @click="refreshSecret">
        随机生成
      </a-button>
    </template>
  </Input>
</template>

<script setup lang="ts">
  import { Input } from 'ant-design-vue';
  import { IconEnum } from '@/enums/appEnum';
  import { buildUUID } from '@/utils/uuid';

  defineOptions({ name: 'SecretInput' });

  defineProps({
    disabled: {
      type: Boolean,
      default: false,
    },
  });

  const value = defineModel<string>('value', {
    type: String,
    required: false,
  });

  function refreshSecret() {
    value.value = buildUUID();
  }

  /**
   * 万一要在每次新增时打开Drawer刷新
   * 需要调用实例方法
   */
  defineExpose({ refreshSecret });
</script>

<style lang="less" scoped>
  :deep(.ant-input-group-addon) {
    padding: 0;
    border: none;
  }

  :deep(.ant-btn-primary) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
</style>
