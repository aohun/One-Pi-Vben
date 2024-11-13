<template>
  <div>
    <Collapse v-model:activeKey="currentCollapseItem">
      <CollapsePanel key="1" header="常规">
        <Form
          :model="formData"
          :colon="false"
          name="basic"
          label-align="left"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 16 }"
          autocomplete="off"
        >
          <FormItem
            label="流程标识"
            name="id"
            :rules="[{ required: true, message: '请输入流程标识' }]"
          >
            <Input v-model:value="formData.id" placeholder="输入ID" @change="idChange" />
          </FormItem>
          <FormItem
            label="流程名称"
            name="name"
            :rules="[{ required: true, message: '请输入节点名称' }]"
          >
            <Input v-model:value="formData.name" placeholder="输入节点名称" @change="nameChange" />
          </FormItem>
        </Form>
      </CollapsePanel>
      <CollapsePanel key="2" header="执行监听器">
        <ExecutionListener :element="element" />
      </CollapsePanel>
    </Collapse>
  </div>
</template>

<script setup lang="ts">
  import ExecutionListener from './property/ExecutionListener.vue';
  import useParseElement from '@/components/BpmnDesign/hooks/useParseElement';
  import usePanel from '@/components/BpmnDesign/hooks/usePanel';
  import type { ModdleElement } from 'bpmn';
  import type { ProcessPanel } from 'bpmnDesign';
  import { toRaw, ref } from 'vue';
  import { Collapse, FormItem, Input, Form } from 'ant-design-vue';

  const CollapsePanel = Collapse.Panel;

  interface PropType {
    element: ModdleElement;
  }
  const props = withDefaults(defineProps<PropType>(), {});

  const { parseData } = useParseElement({
    element: toRaw(props.element),
  });
  const { idChange, nameChange } = usePanel({
    element: toRaw(props.element),
  });
  const currentCollapseItem = ref(['1', '2']);
  const formData = ref<ProcessPanel>(parseData<ProcessPanel>());
</script>

<style scoped></style>
