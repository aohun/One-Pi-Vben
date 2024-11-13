import { defHttp } from '@/utils/http/axios';
import { ID, PageQuery } from '@/api/base';
import type {
  TaskInfo,
  StartWorkFlowResp,
  InstanceVariable,
  RejectEntity,
  TaskInstance,
  DeleteMultiInstanceVo,
  DeleteMultiInstanceParams,
  AddMultiInstanceParams,
} from './model';

enum Api {
  root = '/workflow/task',
  startWorkFlow = '/workflow/task/startWorkFlow',
  completeTask = '/workflow/task/completeTask',
  getPageByTaskWait = '/workflow/task/getPageByTaskWait',
  getPageByAllTaskWait = '/workflow/task/getPageByAllTaskWait',
  getPageByTaskFinish = '/workflow/task/getPageByTaskFinish',
  getPageByTaskCopy = '/workflow/task/getPageByTaskCopy',
  getPageByAllTaskFinish = '/workflow/task/getPageByAllTaskFinish',
  claim = '/workflow/task/claim',
  returnTask = '/workflow/task/returnTask',
  delegateTask = '/workflow/task/delegateTask',
  terminationTask = '/workflow/task/terminationTask',
  transferTask = '/workflow/task/transferTask',
  addMultiInstanceExecution = '/workflow/task/addMultiInstanceExecution',
  deleteMultiInstanceExecution = '/workflow/task/deleteMultiInstanceExecution',
  backProcess = '/workflow/task/backProcess',
  getTaskById = '/workflow/task/getTaskById',
  updateAssignee = '/workflow/task/updateAssignee',
  getInstanceVariable = '/workflow/task/getInstanceVariable',
  getTaskNodeList = '/workflow/task/getTaskNodeList',
  getTaskUserIdsByAddMultiInstance = '/workflow/task/getTaskUserIdsByAddMultiInstance',
  getListByDeleteMultiInstance = '/workflow/task/getListByDeleteMultiInstance',
}

// 启动任务
export function startWorkFlow(data: any) {
  return defHttp.post<StartWorkFlowResp>({ url: Api.startWorkFlow, data });
}

// 办理任务
export function completeTask(data: any) {
  return defHttp.postWithMsg<void>({ url: Api.completeTask, data });
}

// 查询当前用户的待办任务
export function getPageByTaskWait(params?: PageQuery) {
  return defHttp.get<TaskInfo[]>({ url: Api.getPageByTaskWait, params });
}

// 查询当前租户所有待办任务
export function getPageByAllTaskWait(params?: PageQuery) {
  return defHttp.get<TaskInfo[]>({ url: Api.getPageByAllTaskWait, params });
}

// 查询当前用户的已办任务
export function getPageByTaskFinish(params?: PageQuery) {
  return defHttp.get<TaskInfo[]>({ url: Api.getPageByTaskFinish, params });
}

// 查询当前用户的抄送
export function getPageByTaskCopy(params?: PageQuery) {
  return defHttp.get<TaskInfo[]>({ url: Api.getPageByTaskCopy, params });
}

// 查询当前租户所有已办任务
export function getPageByAllTaskFinish(params?: PageQuery) {
  return defHttp.get<TaskInfo[]>({ url: Api.getPageByAllTaskFinish, params });
}

// 签收（拾取）任务
export function claim(taskId: string) {
  return defHttp.postWithMsg<void>({ url: `${Api.claim}/${taskId}` });
}

// 归还（拾取的）任务
export function returnTask(taskId: string) {
  return defHttp.postWithMsg<void>({ url: `${Api.returnTask}/${taskId}` });
}

// 委派任务
export function delegateTask(data: any) {
  return defHttp.postWithMsg<void>({ url: Api.delegateTask, data });
}

// 终止任务
export function terminationTask(data: any) {
  return defHttp.postWithMsg<void>({ url: Api.terminationTask, data });
}

// 转办任务
export function transferTask(data: any) {
  return defHttp.postWithMsg<void>({ url: Api.transferTask, data });
}

/**
 * 会签任务加签
 * @param data
 * @returns
 */
export function addMultiInstanceExecution(data: AddMultiInstanceParams) {
  return defHttp.postWithMsg<void>({ url: Api.addMultiInstanceExecution, data });
}

/**
 * 会签任务减签
 * @param data
 * @returns
 */
export function deleteMultiInstanceExecution(data: DeleteMultiInstanceParams) {
  return defHttp.postWithMsg<void>({ url: Api.deleteMultiInstanceExecution, data });
}

// 驳回审批
export function backProcess(data: any) {
  return defHttp.post<void>({ url: Api.backProcess, data });
}

// 获取当前任务
export function getTaskById(taskId: string) {
  return defHttp.get<TaskInstance>({ url: `${Api.getTaskById}/${taskId}` });
}

// 修改任务办理人
export function updateAssignee(taskIds: string[], userId: ID) {
  return defHttp.putWithMsg<void>({ url: `${Api.updateAssignee}/${taskIds}/${userId}` });
}

/**
 * 流程变量
 * @param id id
 * @returns
 */
export function getInstanceVariable(id: ID) {
  return defHttp.get<InstanceVariable[]>({ url: `${Api.getInstanceVariable}/${id}` });
}

/**
 * 获取可驳回得任务节点
 * @param processInstanceId
 * @returns
 */
export function getTaskNodeList(processInstanceId: string) {
  return defHttp.get<RejectEntity[]>({ url: `${Api.getTaskNodeList}/${processInstanceId}` });
}
/**
 * 查询工作流任务用户选择加签人员
 * @param taskId 任务id
 * @returns id(join) 1,2,3
 */
export function getTaskUserIdsByAddMultiInstance(taskId: string) {
  return defHttp.get<string>({ url: Api.getTaskUserIdsByAddMultiInstance + '/' + taskId });
}

/**
 * 查询工作流选择减签人员
 * @param taskId 任务id
 * @returns
 */
export function getListByDeleteMultiInstance(taskId: string) {
  return defHttp.get<DeleteMultiInstanceVo[]>({
    url: Api.getListByDeleteMultiInstance + '/' + taskId,
  });
}
