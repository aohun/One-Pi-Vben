import { defHttp } from '@/utils/http/axios';
import type { ProcessInstance, CancelProcessInstanceReq, HistoryRecord } from './model';
import { PageQuery } from '@/api/base';

enum Api {
  root = '/workflow/processInstance',
  getPageByRunning = '/workflow/processInstance/getPageByRunning',
  getPageByFinish = '/workflow/processInstance/getPageByFinish',
  getHistoryImage = '/workflow/processInstance/getHistoryImage',
  getHistoryList = '/workflow/processInstance/getHistoryList',
  getHistoryRecord = '/workflow/processInstance/getHistoryRecord',
  deleteRunInstance = '/workflow/processInstance/deleteRunInstance',
  deleteRunAndHisInstance = '/workflow/processInstance/deleteRunAndHisInstance',
  deleteFinishAndHisInstance = '/workflow/processInstance/deleteFinishAndHisInstance',
  cancelProcessApply = '/workflow/processInstance/cancelProcessApply',
  getPageByCurrent = '/workflow/processInstance/getPageByCurrent',
  taskUrging = '/workflow/processInstance/taskUrging',
}

// 分页查询正在运行的流程实例
export function getPageByRunning(params?: PageQuery) {
  return defHttp.get<ProcessInstance[]>({ url: Api.getPageByRunning, params });
}

// 分页查询已结束的流程实例
export function getPageByFinish(params?: PageQuery) {
  return defHttp.get<ProcessInstance[]>({ url: Api.getPageByFinish, params });
}

// 通过流程实例id获取历史流程图
export function getHistoryImage(businessKey: string) {
  return defHttp.get<string>({ url: Api.getHistoryImage + '/' + businessKey });
}

// 通过流程实例id获取历史流程图运行中，历史等节点
export function getHistoryList(businessKey: string) {
  return defHttp.get<any>({ url: Api.getHistoryList + '/' + businessKey });
}

// 获取审批记录
export function getHistoryRecord(businessKey: string) {
  return defHttp.get<HistoryRecord[]>({ url: Api.getHistoryRecord + '/' + businessKey });
}

// 作废流程实例，不会删除历史记录(删除运行中的实例)
export function deleteRunInstance(data: CancelProcessInstanceReq) {
  return defHttp.postWithMsg<void>({ url: Api.deleteRunInstance, data });
}

// 运行中的实例 删除程实例，删除历史记录，删除业务与流程关联信息
export function deleteRunAndHisInstance(businessKeys: string[]) {
  return defHttp.deleteWithMsg<void>({
    url: `${Api.deleteRunAndHisInstance}/${businessKeys.join(',')}`,
  });
}

// 已完成的实例 删除程实例，删除历史记录，删除业务与流程关联信息
export function deleteFinishAndHisInstance(businessKeys: string[]) {
  return defHttp.deleteWithMsg<void>({
    url: `${Api.deleteFinishAndHisInstance}/${businessKeys.join(',')}`,
  });
}

// 撤销流程申请
export function cancelProcessApply(businessKey: string) {
  return defHttp.postWithMsg<void>({ url: Api.cancelProcessApply + '/' + businessKey });
}

// 分页查询当前登录人单据
export function getPageByCurrent(params?: PageQuery) {
  return defHttp.get<ProcessInstance[]>({ url: Api.getPageByCurrent, params });
}

// 任务催办(给当前任务办理人发送站内信，邮件，短信等)
export function taskUrging(data: any) {
  return defHttp.postWithMsg<void>({ url: Api.taskUrging, data });
}
