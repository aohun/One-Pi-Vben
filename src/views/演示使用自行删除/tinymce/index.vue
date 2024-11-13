<template>
  <PageWrapper>
    <div class="flex w-full flex-col gap-16px">
      <Alert type="info">
        <template #message> 使用自托管(本地)TinyMCE, 没有key的限制, 尽情享受吧! </template>
      </Alert>
      <div class="flex items-center gap-8px">
        禁用: <Switch v-model:checked="options.readonly" />
      </div>
      <Tinymce v-model="content" :height="800" :options="options" />
    </div>
  </PageWrapper>
</template>
<script setup lang="ts">
  import { Tinymce } from '@/components/Tinymce';
  import { reactive, ref } from 'vue';
  import { PageWrapper } from '@/components/Page';
  import { Alert, Switch } from 'ant-design-vue';

  const options = reactive({ readonly: false, plugins: [] });
  const content = ref('');
</script>

<style scoped></style>
