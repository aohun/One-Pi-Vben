<template>
  <div class="bpmn-viewer w-full h-full">
    <div id="toolbar" class="flex flex-row justify-between items-center mb-24px">
      <div v-if="type === 'businessKey'">
        <Tag color="gray">未完成</Tag>
        <Tag color="warning">进行中</Tag>
        <Tag color="green">已完成</Tag>
      </div>
      <Space>
        <Tooltip placement="bottom">
          <template #title>
            <span>适应屏幕(居中)</span>
          </template>
          <a-button pre-icon="material-symbols:center-focus-strong-outline" @click="fitViewport" />
        </Tooltip>
        <Tooltip placement="bottom">
          <template #title>
            <span>缩小视图</span>
          </template>
          <a-button pre-icon="ooui:zoom-out" @click="zoomViewport(false)" />
        </Tooltip>
        <Tooltip placement="bottom">
          <template #title>
            <span>放大视图</span>
          </template>
          <a-button pre-icon="ooui:zoom-in" @click="zoomViewport(true)" />
        </Tooltip>
      </Space>
    </div>
    <div ref="containerRef" class="w-full h-full"></div>
  </div>
</template>

<script setup lang="ts">
  import BpmnViewer from 'bpmn-js/lib/Viewer';
  import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';
  import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll';
  import { ModuleDeclaration } from 'didi';
  import type { Canvas, ModdleElement } from 'bpmn';
  import { Tooltip, Space, Tag } from 'ant-design-vue';
  import EventBus from 'diagram-js/lib/core/EventBus';
  import Overlays from 'diagram-js/lib/features/overlays/Overlays';
  import { getHistoryList } from '@/api/workflow/processInstance';
  import { onMounted, ref } from 'vue';

  /**
   * businessKey为查看流程进度使用
   * xml为仅预览流程图使用
   *
   * default: businessKey是为了兼容以前的代码
   */
  const props = defineProps({
    type: {
      type: String as PropType<'businessKey' | 'xml'>,
      default: 'businessKey',
    },
    xml: {
      type: String,
      required: false,
    },
    businessKey: {
      type: String,
      required: false,
    },
  });

  /** bpmn实例 */
  const bpmnModeler = ref<BpmnViewer>();
  /** 挂载的div */
  const containerRef = ref<HTMLDivElement>();
  /** 数据 */
  const bpmnXml = ref<string>('');
  const taskList = ref<any[]>([]);
  const historyList = ref<any[]>([]);
  /** 缩放 */
  const zoom = ref<number>(1);

  onMounted(async () => {
    // 存在的话创建一个新的实例
    if (bpmnModeler.value) {
      bpmnModeler.value.destroy();
    }
    // 创建实例
    bpmnModeler.value = new BpmnViewer({
      container: containerRef.value,
      additionalModules: [
        {
          //禁止滚轮滚动
          zoomScroll: ['value', ''],
        },
        ZoomScrollModule,
        MoveCanvasModule,
      ] as ModuleDeclaration[],
    });

    switch (props.type) {
      case 'businessKey':
        if (!props.businessKey) {
          console.error('businessKey为空 无法加载');
          return;
        }
        // 获取resp
        const resp = await getHistoryList(props.businessKey);

        bpmnXml.value = resp.xml;
        taskList.value = resp.taskList;
        historyList.value = resp.historyList;

        await createDiagram(resp.xml);
        break;
      case 'xml':
        if (!props.xml) {
          console.error('xml为空 无法加载');
          return;
        }
        await createDiagram(props.xml);
        break;
    }
  });

  async function createDiagram(xml: string) {
    try {
      // 导入xml
      await bpmnModeler.value?.importXML(xml);
      // 居中
      fitViewport();
      // 填充颜色
      fillColor();
      // 监听器
      addEventBusListener();
    } catch (err) {
      console.log(err);
    }
  }

  function addEventBusListener() {
    const eventBus = bpmnModeler.value?.get<EventBus>('eventBus');
    const overlays = bpmnModeler.value?.get<Overlays>('overlays');
    if (!eventBus || !overlays) return;
    eventBus.on<ModdleElement>('element.hover', (e) => {
      let data = historyList.value.find((t) => t.taskDefinitionKey === e.element.id);
      if (e.element.type === 'bpmn:UserTask' && data) {
        setTimeout(() => {
          genNodeDetailBox(e, overlays, data);
        }, 10);
      }
    });
    eventBus.on('element.out', () => {
      overlays.clear();
    });
  }

  function genNodeDetailBox(e, overlays, data) {
    overlays.add(e.element.id, {
      position: { top: e.element.height, left: 0 },
      html: `<div class="verlays">
                    <p>审批人员: ${data.nickName || ''}<p/>
                    <p>节点状态：${data.status || ''}</p>
                    <p>开始时间：${data.startTime || ''}</p>
                    <p>结束时间：${data.endTime || ''}</p>
                    <p>审批耗时：${data.runDuration || ''}</p>
                    <p>流程版本：V${data.version || ''}.0</p>
                   </div>`,
    });
  }

  /**
   * 让图能自适应屏幕
   */
  function fitViewport() {
    zoom.value = bpmnModeler.value?.get<Canvas>('canvas').zoom('fit-viewport') || 1;
    const bbox = document.querySelector<SVGGElement>('.bpmn-viewer .viewport')?.getBBox();
    const currentViewBox = bpmnModeler.value?.get<Canvas>('canvas').viewbox();
    if (!bbox || !currentViewBox) {
      return;
    }
    const elementMid = {
      x: bbox.x + bbox.width / 2 - 65,
      y: bbox.y + bbox.height / 2,
    };
    bpmnModeler.value?.get<Canvas>('canvas').viewbox({
      x: elementMid.x - currentViewBox.width / 2,
      y: elementMid.y - currentViewBox.height / 2,
      width: currentViewBox.width,
      height: currentViewBox.height,
    });
    zoom.value = (bbox.width / currentViewBox.width) * 1.8;
  }

  /**
   *
   */
  function zoomViewport(zoomIn = true) {
    zoom.value = bpmnModeler.value?.get<Canvas>('canvas').zoom() || 1;
    zoom.value += zoomIn ? 0.1 : -0.1;
    bpmnModeler.value?.get<Canvas>('canvas').zoom(zoom.value);
  }

  //上色
  function fillColor() {
    const canvas = bpmnModeler.value?.get<Canvas>('canvas');
    const flowElements = (bpmnModeler.value as any)._definitions.rootElements[0].flowElements;
    if (!canvas) return;
    bpmnNodeList(flowElements, canvas);
  }

  //递归上色
  function bpmnNodeList(flowElements: any[], canvas: Canvas) {
    // 拿到最后一个未完成的节点
    const notCompleteNode = taskList.value.findLast((item) => item.completed === false);
    if (notCompleteNode) {
      const newList: any[] = [];
      for (let item of flowElements) {
        // 如果为相同的节点就添加 后续的节点就不再添加 解决被退回还显示完成(绿色)
        if (item.id === notCompleteNode.key) {
          newList.push(item);
          break;
        }
        // 因为按顺序 所以这里直接添加
        newList.push(item);
      }
      flowElements = newList;
    }
    // 原始
    flowElements.forEach((n) => {
      if (n.$type === 'bpmn:UserTask') {
        const completeTask = taskList.value.find((m) => m.key === n.id);
        if (completeTask) {
          canvas.addMarker(n.id, completeTask.completed ? 'highlight' : 'highlight-todo');
          n.outgoing?.forEach((nn) => {
            const targetTask = taskList.value.find((m) => m.key === nn.targetRef.id);
            if (targetTask) {
              canvas.addMarker(nn.id, targetTask.completed ? 'highlight' : 'highlight-todo');
            } else if (nn.targetRef.$type === 'bpmn:ExclusiveGateway') {
              canvas.addMarker(nn.id, completeTask.completed ? 'highlight' : 'highlight-todo');
              canvas.addMarker(
                nn.targetRef.id,
                completeTask.completed ? 'highlight' : 'highlight-todo',
              );
              nn.targetRef.outgoing.forEach((e) => {
                gateway(e.id, e.targetRef.$type, e.targetRef.id, canvas, completeTask.completed);
              });
            } else if (nn.targetRef.$type === 'bpmn:ParallelGateway') {
              canvas.addMarker(nn.id, completeTask.completed ? 'highlight' : 'highlight-todo');
              canvas.addMarker(
                nn.targetRef.id,
                completeTask.completed ? 'highlight' : 'highlight-todo',
              );
              nn.targetRef.outgoing.forEach((e) => {
                gateway(e.id, e.targetRef.$type, e.targetRef.id, canvas, completeTask.completed);
              });
            } else if (nn.targetRef.$type === 'bpmn:InclusiveGateway') {
              canvas.addMarker(nn.id, completeTask.completed ? 'highlight' : 'highlight-todo');
              canvas.addMarker(
                nn.targetRef.id,
                completeTask.completed ? 'highlight' : 'highlight-todo',
              );
              nn.targetRef.outgoing.forEach((e) => {
                gateway(e.id, e.targetRef.$type, e.targetRef.id, canvas, completeTask.completed);
              });
            }
          });
        }
      } else if (n.$type === 'bpmn:ExclusiveGateway') {
        n.outgoing.forEach((nn) => {
          const targetTask = taskList.value.find((m) => m.key === nn.targetRef.id);
          if (targetTask) {
            canvas.addMarker(nn.id, targetTask.completed ? 'highlight' : 'highlight-todo');
          }
        });
      } else if (n.$type === 'bpmn:ParallelGateway') {
        n.outgoing.forEach((nn) => {
          const targetTask = taskList.value.find((m) => m.key === nn.targetRef.id);
          if (targetTask) {
            canvas.addMarker(nn.id, targetTask.completed ? 'highlight' : 'highlight-todo');
          }
        });
      } else if (n.$type === 'bpmn:InclusiveGateway') {
        n.outgoing.forEach((nn) => {
          const targetTask = taskList.value.find((m) => m.key === nn.targetRef.id);
          if (targetTask) {
            canvas.addMarker(nn.id, targetTask.completed ? 'highlight' : 'highlight-todo');
          }
        });
      } else if (n.$type === 'bpmn:SubProcess') {
        const completeTask = taskList.value.find((m) => m.key === n.id);
        if (completeTask) {
          canvas.addMarker(n.id, completeTask.completed ? 'highlight' : 'highlight-todo');
        }
        bpmnNodeList(n.flowElements, canvas);
      } else if (n.$type === 'bpmn:StartEvent') {
        canvas.addMarker(n.id, 'startEvent');
        if (n.outgoing) {
          n.outgoing.forEach((nn) => {
            const completeTask = taskList.value.find((m) => m.key === nn.targetRef.id);
            if (completeTask) {
              canvas.addMarker(nn.id, 'highlight');
              canvas.addMarker(n.id, 'highlight');
              // return;
            }
          });
        }
      } else if (n.$type === 'bpmn:EndEvent') {
        canvas.addMarker(n.id, 'endEvent');
        const completeTask = taskList.value.find((m) => m.key === n.id);
        if (completeTask) {
          canvas.addMarker(completeTask.key, 'highlight');
          canvas.addMarker(n.id, 'highlight');
          return;
        }
      }
    });
  }

  function gateway(id, targetRefType, targetRefId, canvas, completed) {
    if (targetRefType === 'bpmn:ExclusiveGateway') {
      canvas.addMarker(id, completed ? 'highlight' : 'highlight-todo');
      canvas.addMarker(targetRefId, completed ? 'highlight' : 'highlight-todo');
    }
    if (targetRefType === 'bpmn:ParallelGateway') {
      canvas.addMarker(id, completed ? 'highlight' : 'highlight-todo');
      canvas.addMarker(targetRefId, completed ? 'highlight' : 'highlight-todo');
    }
    if (targetRefType === 'bpmn:InclusiveGateway') {
      canvas.addMarker(id, completed ? 'highlight' : 'highlight-todo');
      canvas.addMarker(targetRefId, completed ? 'highlight' : 'highlight-todo');
    }
  }
</script>

<style lang="less" scoped>
  @import './index.less';
</style>
