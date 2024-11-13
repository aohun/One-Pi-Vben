<template>
  <BasicModal
    v-bind="$attrs"
    title="预览"
    :width="800"
    :showCancelBtn="false"
    :showOkBtn="false"
    @register="registerModalInner"
    @cancel="handleClose"
  >
    <CodeEditor v-if="currentType === 'xml'" :value="currentContent" read-only :mode="MODE.XML" />
    <div>
      <!-- todo 大小还有问题 -->
      <!-- eslint-disable-next-line vue/no-v-html -->
      <svg class="w-full h-100vh" v-if="currentType === 'svg'" v-html="currentContent" />
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { CodeEditor, MODE } from '@/components/CodeEditor';
  import { ref } from 'vue';

  type PreviewType = 'svg' | 'xml';

  const currentType = ref<PreviewType>('xml');
  const currentContent = ref<string>('');
  const [registerModalInner, { closeModal }] = useModalInner(
    (data: { type: PreviewType; content: string }) => {
      console.log(data);
      currentType.value = data.type;
      currentContent.value = data.content;
    },
  );

  function handleClose() {
    currentType.value = 'xml';
    currentContent.value = '';
    closeModal();
  }
</script>

<style scoped lang="less">
  :deep(.CodeMirror) {
    height: auto;
  }
</style>
