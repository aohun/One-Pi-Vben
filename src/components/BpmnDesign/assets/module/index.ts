// 翻译模块
import TranslationModule from './Translate';
import { ModuleDeclaration } from 'didi';
import CustomPaletteProvider from './Palette/CustomPaletteProvider';
import CustomRenderer from './Renderer/CustomRenderer';
import CustomContextPadProvider from './ContextPad/CustomContextPadProvider';
// 流程模拟 仿真
import TokenSimulation from 'bpmn-js-token-simulation';
// 流程模拟的css 一定要导入
import 'bpmn-js-token-simulation/assets/css/bpmn-js-token-simulation.css';
// 小地图
import MinimapModule from 'diagram-js-minimap';
import 'diagram-js-minimap/assets/diagram-js-minimap.css';

const Module: ModuleDeclaration[] = [
  {
    __init__: ['customPaletteProvider', 'customContextPadProvider', 'customRenderer'],
    customPaletteProvider: ['type', CustomPaletteProvider],
    customRenderer: ['type', CustomRenderer],
    customContextPadProvider: ['type', CustomContextPadProvider],
  },
  TranslationModule,
  TokenSimulation,
  MinimapModule,
];
export default Module;
