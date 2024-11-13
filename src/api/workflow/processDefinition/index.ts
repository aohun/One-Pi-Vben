import { defHttp } from '@/utils/http/axios';
import { ID, PageQuery } from '@/api/base';
import { ProcessDefinition, XmlResponse } from './model';

enum Api {
  root = '/workflow/processDefinition',
  processDefinitionList = '/workflow/processDefinition/list',
  processDefinitionXml = '/workflow/processDefinition/definitionXml',
  processDefinitionImage = '/workflow/processDefinition/definitionImage',
  convertToModel = '/workflow/processDefinition/convertToModel',
  getListByKey = '/workflow/processDefinition/getListByKey',
  migrationDefinition = '/workflow/processDefinition/migrationDefinition',
  deployByFile = '/workflow/processDefinition/deployByFile',
  updateDefinitionState = '/workflow/processDefinition/updateDefinitionState',
}

export function processDefinitionList(params?: PageQuery) {
  return defHttp.get<ProcessDefinition[]>({ url: Api.processDefinitionList, params });
}

export function processDefinitionXml(id: ID) {
  return defHttp.get<XmlResponse>({ url: Api.processDefinitionXml + '/' + id });
}

/**
 *
 * @param id
 * @returns
 * @deprecated 不需要这个生成图片的方法  使用bpmn预览器代替
 */
export function processDefinitionImage(id: ID) {
  return defHttp.get<string>({ url: Api.processDefinitionImage + '/' + id });
}

// 转换模型
export function convertToModel(id: ID) {
  return defHttp.putWithMsg<ProcessDefinition>({ url: Api.convertToModel + '/' + id });
}

// 历史版本
export function getListByKey(key: string) {
  return defHttp.get<ProcessDefinition[]>({ url: `${Api.getListByKey}/${key}` });
}

/**
 *
 * 迁移流程定义
 * @param currentProcessDefinitionId 当前流程定义id
 * @param toProcessDefinitionId 切换到流程定义id
 * @returns none
 */
export function migrationDefinition(
  currentProcessDefinitionId: string,
  toProcessDefinitionId: string,
) {
  return defHttp.putWithMsg<void>({
    url: `${Api.migrationDefinition}/${currentProcessDefinitionId}/${toProcessDefinitionId}`,
  });
}

export function processDefinitionRemove(deploymentId: string, processDefinitionId: string) {
  return defHttp.deleteWithMsg<void>({ url: `${Api.root}/${deploymentId}/${processDefinitionId}` });
}

// 激活/挂起流程
export function updateDefinitionState(id: string) {
  return defHttp.putWithMsg<void>({ url: `${Api.updateDefinitionState}/${id}` });
}
