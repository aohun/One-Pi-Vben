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
            label="节点标识"
            name="id"
            :rules="[{ required: true, message: '输入节点标识' }]"
          >
            <Input v-model:value="formData.id" placeholder="请输入" @change="idChange" />
          </FormItem>
          <FormItem label="节点名称" name="name">
            <Input v-model:value="formData.name" placeholder="请输入" @change="nameChange" />
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
  import type { GatewayPanel } from 'bpmnDesign';
  import ExecutionListener from '@/components/BpmnDesign/panel/property/ExecutionListener.vue';
  import { toRaw, ref } from 'vue';
  import { Collapse, FormItem, Input, Form } from 'ant-design-vue';

  const CollapsePanel = Collapse.Panel;

  interface PropType {
    element: ModdleElement;
  }
  const props = withDefaults(defineProps<PropType>(), {});
  const { nameChange, idChange } = usePanel({
    element: toRaw(props.element),
  });
  const { parseData } = useParseElement({
    element: toRaw(props.element),
  });
  const currentCollapseItem = ref(['1', '2']);
  const formData = ref(parseData<GatewayPanel>());
</script>

<style scoped></style>
