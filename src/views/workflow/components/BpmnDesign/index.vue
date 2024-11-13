<template>
  <div class="w-full h-full overflow-hidden">
    <BpmnDesign ref="bpmnRef" @save="handleSave">
      <template #menuRight>
        <Space>
          <a-button @click="handleClose">关闭页面</a-button>
        </Space>
      </template>
    </BpmnDesign>
  </div>
</template>

<script setup lang="ts">
  import BpmnDesign from '@/components/BpmnDesign/index.vue';
  import { onMounted, ref } from 'vue';
  import { flowModelInfo, flowModelEditXml } from '@/api/workflow/model';
  import type { FlowModelInfo } from '@/api/workflow/model/model';
  import { useRoute } from 'vue-router';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useTabs } from '@/hooks/web/useTabs';
  import { Space } from 'ant-design-vue';

  defineOptions({ name: 'BpmnDesignPage' });

  /** 拿到路由的id */
  const route = useRoute();
  const currentId = (route.params.id as string) || '0';
  /** instance */
  const bpmnRef = ref<InstanceType<typeof BpmnDesign>>();
  /** 提交用 */
  const modelInfo = ref<FlowModelInfo>();
  const { setTitle, closeCurrent } = useTabs();

  onMounted(async () => {
    // 请求获取xml
    const ret = await flowModelInfo(currentId);
    console.log(ret);
    modelInfo.value = ret;
    // 设置名称
    setTitle('流程设计: ' + ret.name);
    // 导入xml
    bpmnRef.value?.initDiagram(ret.xml);
  });

  const { createConfirm } = useMessage();
  function handleSave(data: Recordable) {
    if (!modelInfo.value) return;
    // 构建请求参数
    const requestBody = {
      ...modelInfo.value,
      ...data,
    };
    console.log(requestBody);
    const modal = createConfirm({
      iconType: 'warning',
      title: '提示',
      content: '是否确认保存',
      async onOk() {
        try {
          await flowModelEditXml(requestBody);
          closeCurrent();
        } catch (e) {
          // 报错时候关闭modal
          modal.destroy();
        }
      },
    });
  }

  function handleClose() {
    createConfirm({
      iconType: 'warning',
      title: '提示',
      content: '是否确认关闭当前页面',
      onOk() {
        closeCurrent();
      },
    });
  }
</script>

<style scoped></style>
