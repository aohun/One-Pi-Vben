export interface HistoryRecord {
  id: string;
  taskDefinitionKey: string;
  name: string;
  processInstanceId: string;
  startTime: string;
  endTime?: any;
  runDuration?: any;
  status: string;
  statusName: string;
  assignee?: any;
  nickName?: any;
  owner?: any;
  commentId?: any;
  comment?: any;
  attachmentList?: any;
}

export interface NodeListInfo {
  id: string;
  taskDefinitionKey: string;
  name: string;
  processInstanceId: string;
  startTime: string;
  endTime: string;
  runDuration: string;
  status: string;
  statusName: string;
  assignee: number;
  nickName: string;
  owner?: any;
  commentId?: any;
  comment: string;
  attachmentList?: any;
}

export interface GraphicInfoVo {
  x: number;
  y: number;
  height: number;
  width: number;
  nodeId: string;
  nodeName: string;
}

export interface ProcessInstance {
  id: string;
  processDefinitionId: string;
  processDefinitionName: string;
  processDefinitionKey: string;
  processDefinitionVersion: string;
  deploymentId: string;
  businessKey: string;
  isSuspended: boolean;
  tenantId: string;
  startTime: string;
  endTime?: string;
  startUserId: string;
  businessStatus: string;
  businessStatusName: string;
  taskVoList?: any;
}

// 作废流程实例
export interface CancelProcessInstanceReq {
  // 实例ID
  processInstanceId: string;
  // 作废原因
  deleteReason: string;
}
