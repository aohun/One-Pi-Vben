<template>
  <div class="bpmn-page">
    <!-- dark模式下 连接线的箭头样式 -->
    <svg width="0" height="0" style="position: absolute">
      <defs>
        <marker
          id="markerArrow-dark-mode"
          viewBox="0 0 20 20"
          refX="11"
          refY="10"
          markerWidth="10"
          markerHeight="10"
          orient="auto"
        >
          <path d="M 1 5 L 11 10 L 1 15 Z" class="arrow-dark" />
        </marker>
      </defs>
    </svg>
    <!--  菜单栏-->
    <div class="flex justify-between p-2">
      <Space>
        <a-button type="primary" @click="handleSave"> 保存 </a-button>
        <Dropdown>
          <template #overlay>
            <Menu @click="handleExportClick">
              <MenuItem key="exportXml"><Icon icon="carbon:xml" class="mr-1" />导出xml</MenuItem>
              <MenuItem key="exportSvg"
                ><Icon icon="teenyicons:svg-outline" class="mr-1" />导出svg</MenuItem
              >
            </Menu>
          </template>
          <a-button pre-icon="ph:export-light"> 导出 </a-button>
        </Dropdown>
        <Dropdown>
          <template #overlay>
            <Menu @click="handlePreview">
              <MenuItem key="xml"><Icon icon="carbon:xml" class="mr-1" />预览xml</MenuItem>
              <MenuItem key="svg"><Icon icon="carbon:json" class="mr-1" />预览svg</MenuItem>
            </Menu>
          </template>
          <a-button pre-icon="mage:preview"> 预览 </a-button>
        </Dropdown>
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
        <Tooltip placement="bottom">
          <template #title>
            <span>撤销</span>
          </template>
          <a-button pre-icon="grommet-icons:link-previous" @click="bpmnUndo" />
        </Tooltip>
        <Tooltip placement="bottom">
          <template #title>
            <span>恢复</span>
          </template>
          <a-button pre-icon="grommet-icons:link-next" @click="bpmnRedo" />
        </Tooltip>
        <Tooltip placement="bottom">
          <template #title>
            <span>开启/关闭流程模拟</span>
          </template>
          <a-button pre-icon="fluent:desktop-flow-20-regular" @click="toggleSimulation" />
        </Tooltip>
        <Tooltip placement="bottom">
          <template #title>
            <span>展开/收起小地图</span>
          </template>
          <a-button pre-icon="gis:map-rm" @click="toggleMinimap" />
        </Tooltip>
        <!-- 显示/隐藏属性栏 -->
        <a-button pre-icon="akar-icons:panel-right" @click="togglePropertiesPanelVisible">
          {{ propertiesBtnText }}
        </a-button>
      </Space>
      <slot name="menuRight"> </slot>
    </div>
    <!-- 内容 -->
    <div class="flex flex-row h-full w-full">
      <!-- 这里减掉的48px就是头部的工具栏 让设计器占满剩下的高度 -->
      <!-- flex1占满剩余宽度 -->
      <div id="container" ref="containerRef" class="flex-1 h-[calc(100%-48px)]"></div>
      <!-- 属性面板 宽度写死 -->
      <BpmnPropertyPanel
        :enableTransition="true"
        :panelVisible="computedPropertiesPanelVisible"
        v-if="bpmnModeler"
        :modeler="bpmnModeler"
        :class="propertiesBarClass"
      />
    </div>
    <PreviewModal @register="registerPreviewModal" />
  </div>
</template>

<script setup lang="ts">
  import 'bpmn-js/dist/assets/diagram-js.css';
  import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
  import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
  import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
  import { Dropdown, Menu, MenuItem, Tooltip, Space } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';
  import type { Canvas } from 'bpmn';
  import BpmnModeler from 'bpmn-js/lib/Modeler.js';
  import Modules from '@/components/BpmnDesign/assets/module/index';
  import flowableModdle from '@/components/BpmnDesign/assets/moddle/flowable';
  // 默认xml
  import defaultXML from '@/components/BpmnDesign/assets/defaultXML';
  import { downloadByData } from '@/utils/file/download';
  import PreviewModal from '@/components/BpmnDesign/components/PreviewModal.vue';
  import { useModal } from '@/components/Modal';
  import { computed, onMounted, ref } from 'vue';
  import { useLocalStorage } from '@vueuse/core';
  import type { MenuInfo } from 'ant-design-vue/lib/menu/src/interface';
  import useModelerStore from '@/store/modules/modeler';
  /** 属性面板 */
  import BpmnPropertyPanel from '@/components/BpmnDesign/panel/index.vue';

  defineOptions({ name: 'BpmnDesign' });

  const props = defineProps({
    xml: {
      type: String,
      default: defaultXML,
    },
  });

  const emit = defineEmits(['save']);

  /** bpmn */
  const containerRef = ref<HTMLDivElement>();
  /** 实例对象 */
  const bpmnModeler = ref<BpmnModeler>();
  /** 缩放 */
  const zoom = ref<number>(1);
  /**  */
  const modelerStore = useModelerStore();

  /**
   * 隐藏属性栏
   */
  const propertiesPanelVisible = useLocalStorage<boolean>(
    '__bpmn_design_properties_panel_visible__',
    true,
  );
  /**
   * 无奈之举  vscode报错
   * 不能将类型“RemovableRef<boolean>”分配给类型“boolean”。ts-plugin(2322)
   */
  const computedPropertiesPanelVisible = computed(() => {
    return propertiesPanelVisible.value;
  });
  function togglePropertiesPanelVisible() {
    propertiesPanelVisible.value = !propertiesPanelVisible.value;
  }

  const propertiesBtnText = computed(() => {
    return propertiesPanelVisible.value ? '隐藏属性栏' : '显示属性栏';
  });

  /**
   * 属性栏class
   */
  const propertiesBarClass = computed(() => {
    // 显示 给一个固定宽度
    if (propertiesPanelVisible.value) {
      return `w-460px h-full`;
    }
    // 隐藏
    return 'w-0';
  });

  /**
   * mounted
   */
  onMounted(() => {
    bpmnModeler.value = new BpmnModeler({
      // 挂载到div
      container: containerRef.value,
      // 监听键盘事件
      keyboard: {
        bindTo: window,
      },
      // 插件
      additionalModules: Modules,
      moddleExtensions: {
        flowable: flowableModdle,
      },
    });

    initModeler();
    // 导入xml
    initDiagram(props.xml);
  });

  /**
   * 初始化
   */
  function initModeler() {
    if (modelerStore.getModeler()) {
      modelerStore.getModeler()?.destroy();
      modelerStore.setModeler(undefined);
    }
    modelerStore.setModeler(bpmnModeler.value);
  }

  /**
   * 加载xml
   */
  function initDiagram(xml?: string) {
    if (!xml) xml = defaultXML;
    bpmnModeler.value?.importXML(xml);
  }

  /**
   * 自适应屏幕
   */
  function fitViewport() {
    zoom.value = bpmnModeler.value?.get<Canvas>('canvas').zoom('fit-viewport') || 1;
    // 这里必须是containerRef的父元素才能获取到
    const bbox = document.querySelector<SVGGElement>('.bpmn-page .viewport')?.getBBox();
    if (!bbox) {
      console.warn('.bpmn-page .viewport getBBox fail');
      return;
    }
    const currentViewBox = bpmnModeler.value?.get<Canvas>('canvas').viewbox();
    const elementMid = {
      x: bbox.x + bbox.width / 2 - 65,
      y: bbox.y + bbox.height / 2,
    };
    if (!currentViewBox) {
      console.warn('viewbox fail');
      return;
    }
    bpmnModeler.value?.get<Canvas>('canvas').viewbox({
      x: elementMid.x - currentViewBox.width / 2,
      y: elementMid.y - currentViewBox.height / 2,
      width: currentViewBox.width,
      height: currentViewBox.height,
    });
    zoom.value = (bbox.width / currentViewBox.width) * 1.8;
  }

  /**
   * 放大或者缩小
   * @param zoomIn true 放大 | false 缩小
   */
  function zoomViewport(zoomIn = true) {
    zoom.value = bpmnModeler.value?.get<Canvas>('canvas').zoom() || 1;
    zoom.value += zoomIn ? 0.1 : -0.1;
    bpmnModeler.value?.get<Canvas>('canvas').zoom(zoom.value);
  }

  /**
   * 撤销
   */
  function bpmnUndo() {
    bpmnModeler.value?.get<any>('commandStack').undo();
  }

  /**
   * 恢复
   */
  function bpmnRedo() {
    bpmnModeler.value?.get<any>('commandStack').redo();
  }

  function getProcessElement() {
    const rootElements = bpmnModeler.value?.getDefinitions().rootElements;
    for (let i = 0; i < rootElements.length; i++) {
      if (rootElements[i].$type === 'bpmn:Process') return rootElements[i];
    }
  }

  /**
   * 下载XML
   */
  async function downloadXML() {
    try {
      // 为啥要写这个  因为ESlint报错了 --!
      if (!bpmnModeler.value) return;
      const { xml = '' } = await bpmnModeler.value.saveXML({ format: true });

      // 下载准备
      const elementName = getProcessElement().name ?? 'unknown';
      const filename = `${elementName}.bpmn20.xml`;
      const mimeType = 'application/xml';
      const blob = new Blob([xml], { type: mimeType });

      downloadByData(blob, filename, mimeType);
    } catch (e) {
      console.warn(e);
    }
  }

  /**
   * 下载SVG
   */
  async function downloadSVG() {
    try {
      // 为啥要写这个  因为ESlint报错了 --!
      if (!bpmnModeler.value) return;
      const { svg } = await bpmnModeler.value.saveSVG();

      // 这个不用加.svg
      const filename = getProcessElement().name ?? 'unknown';
      const mimeType = 'image/svg+xml';
      const blob = new Blob([svg], { type: mimeType });

      downloadByData(blob, filename, mimeType);
    } catch (e) {
      console.warn(e);
    }
  }

  /**
   * 导出 回调
   */
  async function handleExportClick(e: MenuInfo) {
    switch (e.key) {
      case 'exportXml':
        await downloadXML();
        break;
      case 'exportSvg':
        await downloadSVG();
        break;
    }
  }

  /**
   * 预览XML
   */
  async function previewXML() {
    if (!bpmnModeler.value) return;
    const { xml = '' } = await bpmnModeler.value.saveXML({ format: true });
    openPreviewModal(true, { type: 'xml', content: xml });
  }

  /**
   * 预览SVG
   */
  async function previewSVG() {
    if (!bpmnModeler.value) return;
    const { svg } = await bpmnModeler.value.saveSVG();
    console.log(svg);
    openPreviewModal(true, { type: 'svg', content: svg });
  }

  const [registerPreviewModal, { openModal: openPreviewModal }] = useModal();
  async function handlePreview(e: MenuInfo) {
    switch (e.key) {
      case 'xml':
        await previewXML();
        break;
      case 'svg':
        await previewSVG();
        break;
    }
  }

  /**
   * 启动/关闭模拟执行
   */
  function toggleSimulation() {
    if (!bpmnModeler.value) return;
    bpmnModeler.value.get<any>('toggleMode').toggleMode();
  }

  /**
   * 切换小地图显示
   */
  function toggleMinimap() {
    bpmnModeler.value?.get<any>('minimap').toggle();
  }

  function getProcess() {
    const element = getProcessElement();
    return {
      id: element.id,
      name: element.name,
    };
  }

  async function handleSave() {
    if (!bpmnModeler.value) return;
    const { xml } = await bpmnModeler.value.saveXML({ format: true });
    const { svg } = await bpmnModeler.value.saveSVG();
    const process = getProcess();
    const data = {
      xml: xml,
      svg: svg,
      key: process.id,
      name: process.name,
    };
    emit('save', data);
  }

  defineExpose({
    initDiagram,
  });
</script>

<style lang="less">
  @import './assets/style/index.less';

  /** dark模式下 连接线的箭头样式 */
  .arrow-dark {
    stroke-width: 1px;
    stroke-linecap: round;
    stroke: @stroke-color-dark;
    fill: @stroke-color-dark;
    stroke-linejoin: round;
  }
</style>
