<template>
  <PageWrapper title="更新日志">
    <MarkdownViewer class="m-8px" :value="data" />
  </PageWrapper>
</template>

<script setup lang="ts">
  import { MarkdownViewer } from '@/components/Markdown';
  import { ref } from 'vue';
  import { PageWrapper } from '@/components/Page';
  import log from '../../../../CHANGELOG.md?raw';

  const data = ref<string>(log);
</script>

<style scoped></style>
