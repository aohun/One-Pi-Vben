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
          <FormItem label="节点ID" name="id" :rules="[{ required: true, message: '输入节点ID' }]">
            <Input v-model:value="formData.id" placeholder="输入节点ID" @change="idChange" />
          </FormItem>
          <FormItem label="节点名称" name="name">
            <Input v-model:value="formData.name" placeholder="输入节点名称" @change="nameChange" />
          </FormItem>
          <FormItem label="跳转条件" name="conditionExpression">
            <Input
              v-model:value="formData.conditionExpressionValue"
              placeholder="输入跳转条件"
              @change="conditionExpressionChange"
            />
          </FormItem>
          <FormItem v-if="formData.skipExpression" label="跳过表达式" name="skipExpression">
            <Input
              v-model:value="formData.skipExpression"
              placeholder="输入跳过表达式"
              @change="skipExpressionChange"
            />
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
  import useParseElement from '@/components/BpmnDesign/hooks/useParseElement';
  import usePanel from '@/components/BpmnDesign/hooks/usePanel';
  import type { ModdleElement } from 'bpmn';
  import type { SequenceFlowPanel } from 'bpmnDesign';
  import useModelerStore from '@/store/modules/modeler';
  import { toRaw, ref, onBeforeMount } from 'vue';
  import { Collapse, FormItem, Input, Form } from 'ant-design-vue';
  import ExecutionListener from './property/ExecutionListener.vue';

  const CollapsePanel = Collapse.Panel;

  interface PropType {
    element: ModdleElement;
  }
  const props = withDefaults(defineProps<PropType>(), {});
  const { nameChange, idChange, updateProperties } = usePanel({
    element: toRaw(props.element),
  });
  const { parseData } = useParseElement({
    element: toRaw(props.element),
  });
  const moddle = useModelerStore().getModdle();
  const currentCollapseItem = ref(['1', '2']);
  const formData = ref(parseData<SequenceFlowPanel>());

  const conditionExpressionChange = (e: Event & { target: { value?: string | undefined } }) => {
    const value = e.target.value;
    if (value) {
      const newCondition = moddle?.create('bpmn:FormalExpression', { body: value });
      updateProperties({ conditionExpression: newCondition });
    } else {
      updateProperties({ conditionExpression: null });
    }
  };

  const skipExpressionChange = (e: Event & { target: { value?: string | undefined } }) => {
    const value = e.target.value;
    updateProperties({
      'flowable:skipExpression': value && value.length > 0 ? value : undefined,
    });
  };

  onBeforeMount(() => {
    if (formData.value.conditionExpression) {
      formData.value.conditionExpressionValue = formData.value.conditionExpression.body;
    }
  });
</script>

<style scoped></style>
