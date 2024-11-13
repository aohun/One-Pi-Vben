<template>
  <Card :class="panelClass" :title="nodeName" :bodyStyle="cardBodyStyle">
    <component v-show="visible" :is="component" v-if="element" :element="element" />
  </Card>
</template>

<script setup lang="ts">
  import { Card } from 'ant-design-vue';
  import { CSSProperties, computed, nextTick, onMounted, ref, watch } from 'vue';
  import { NodeName } from '../assets/lang/zh';
  import TaskPanel from './TaskPanel.vue';
  import ProcessPanel from './ProcessPanel.vue';
  import StartEndPanel from './StartEndPanel.vue';
  import GatewayPanel from './GatewayPanel.vue';
  import SequenceFlowPanel from './SequenceFlowPanel.vue';
  import type { Modeler, ModdleElement } from 'bpmn';

  const cardBodyStyle = ref<CSSProperties>({
    padding: 0,
  });

  interface propsType {
    modeler: Modeler;
    panelVisible: boolean; // 控制面板隐藏 / 显示
    enableTransition: boolean; // 是否开启过渡效果
  }
  const props = withDefaults(defineProps<propsType>(), {});
  /** 控制过渡效果 */
  const visible = ref(true);
  watch(
    () => props.panelVisible,
    (value) => {
      /** 未开启过渡效果 */
      if (!props.enableTransition) {
        return;
      }
      /** 显示面板  在过渡效果后显示 */
      if (value) {
        setTimeout(() => {
          visible.value = value;
        }, 200);
      } else {
        /** 隐藏面板  马上隐藏 */
        visible.value = value;
      }
    },
    {
      immediate: true,
    },
  );
  /** 过渡的cssClass */
  const panelClass = computed(() => {
    return props.enableTransition ? 'transition-width duration-200' : '';
  });

  const element = ref<ModdleElement | null>();
  const processElement = ref<ModdleElement>();

  const startEndType = ['bpmn:IntermediateThrowEvent', 'bpmn:StartEvent', 'bpmn:EndEvent'];
  const taskType = [
    'bpmn:UserTask',
    'bpmn:Task',
    'bpmn:SendTask',
    'bpmn:ReceiveTask',
    'bpmn:ManualTask',
    'bpmn:BusinessRuleTask',
    'bpmn:ServiceTask',
    'bpmn:ScriptTask',
  ];
  const sequenceType = ['bpmn:SequenceFlow'];
  const gatewayType = [
    'bpmn:InclusiveGateway',
    'bpmn:ExclusiveGateway',
    'bpmn:ParallelGateway',
    'bpmn:EventBasedGateway',
    'bpmn:ComplexGateway',
  ];
  const processType = ['bpmn:Process'];

  // 组件计算
  const component = computed(() => {
    if (!element.value) return null;
    const type = element.value.type;
    if (startEndType.includes(type)) return StartEndPanel;
    if (taskType.includes(type)) return TaskPanel;
    if (sequenceType.includes(type)) return SequenceFlowPanel;
    if (gatewayType.includes(type)) return GatewayPanel;
    if (processType.includes(type)) return ProcessPanel;
    return null;
  });

  const nodeName = computed(() => {
    if (element.value) {
      const bizObj = element.value.businessObject;
      const type =
        bizObj?.eventDefinitions && bizObj?.eventDefinitions.length > 0
          ? bizObj.eventDefinitions[0].$type
          : bizObj.$type;
      return NodeName[type] || type;
    }
    return null;
  });

  const handleModeler = () => {
    props.modeler.on('root.added', (e: any) => {
      element.value = null;
      if (e.element.type === 'bpmn:Process') {
        nextTick(() => {
          element.value = e.element;
          processElement.value = e.element;
        });
      }
    });
    props.modeler.on('element.click', (e: any) => {
      if (e.element.type === 'bpmn:Process') {
        nextTick(() => {
          element.value = e.element;
          processElement.value = e.element;
        });
      }
    });
    props.modeler.on('selection.changed', (e: any) => {
      // 先给null为了让vue刷新
      element.value = null;
      const newElement = e.newSelection[0];
      if (newElement) {
        nextTick(() => {
          element.value = newElement;
        });
      } else {
        nextTick(() => {
          element.value = processElement.value;
        });
      }
    });
  };

  onMounted(() => {
    handleModeler();
  });
</script>

<style scoped></style>
