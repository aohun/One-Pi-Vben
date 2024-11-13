<template>
  <BasicModal
    v-bind="$attrs"
    :title="title"
    :width="900"
    :min-height="600"
    :default-fullscreen="false"
    :can-fullscreen="true"
    @register="registerModalInner"
    @cancel="handleCancel"
  >
    <template v-if="xmlData">
      <CodeEditor v-if="previewType === 'xml'" :value="xmlData" read-only :mode="MODE.XML" />
      <BpmnViewer v-if="previewType === 'image'" type="xml" :xml="xmlData" />
    </template>
    <template #footer></template>
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { CodeEditor, MODE } from '@/components/CodeEditor';
  import { BpmnViewer } from '@/components/BpmnViewer';
  import { ref, computed } from 'vue';
  import { processDefinitionXml } from '@/api/workflow/processDefinition';
  import { PreviewType } from './type';

  defineOptions({ name: 'PreviewModal' });

  const xmlData = ref<string>('');
  const previewType = ref<PreviewType>('xml');

  const title = computed(() => {
    return previewType.value === 'xml' ? 'xml预览' : '流程图预览';
  });

  const [registerModalInner, { modalLoading }] = useModalInner(
    async (data: { type: PreviewType; id: string }) => {
      modalLoading(true);
      const { type, id } = data;
      if (!id) return;
      previewType.value = type;
      /** 获取xml */
      const ret = await processDefinitionXml(id);
      xmlData.value = ret.xmlStr;

      modalLoading(false);
    },
  );

  function handleCancel() {
    /**
     * 触发v-if 重新渲染
     */
    xmlData.value = '';
  }
</script>

<style lang="less" scoped>
  :deep(.CodeMirror) {
    height: 100%;
  }
</style>
