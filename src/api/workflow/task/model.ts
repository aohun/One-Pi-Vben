export interface ParticipantVo {
  groupIds?: any;
  candidate: number[];
  candidateName: string[];
  claim?: any;
}

export interface TaskInfo {
  id: string;
  name: string;
  description?: any;
  priority: number;
  owner?: any;
  assignee: number;
  assigneeName: string;
  processInstanceId: string;
  executionId: string;
  taskDefinitionId?: any;
  processDefinitionId: string;
  createTime: string;
  endTime?: any;
  taskDefinitionKey: string;
  dueDate?: any;
  category?: any;
  parentTaskId?: any;
  tenantId: string;
  claimTime?: any;
  businessStatus: string;
  businessStatusName: string;
  processDefinitionName: string;
  processDefinitionKey: string;
  participantVo: ParticipantVo;
  multiInstance: boolean;
}

export interface StartWorkFlowResp {
  processInstanceId: string;
  taskId: string;
}

export interface InstanceVariable {
  key: string;
  value: string;
}

export interface RejectEntity {
  createDept: number;
  createBy: number;
  createTime: string;
  updateBy: number;
  updateTime: string;
  tenantId: string;
  id: string;
  instanceId: string;
  nodeId: string;
  nodeName: string;
  orderNo: number;
  taskType: string;
  assignee: string;
}

export interface TaskInstance {
  id: string;
  name: string;
  description?: any;
  priority: number;
  owner?: any;
  assignee?: any;
  assigneeName?: any;
  processInstanceId: string;
  executionId: string;
  taskDefinitionId?: any;
  processDefinitionId: string;
  createTime: string;
  startTime?: any;
  endTime?: any;
  taskDefinitionKey: string;
  dueDate?: any;
  category?: any;
  parentTaskId?: any;
  tenantId: string;
  claimTime?: any;
  businessStatus: string;
  businessStatusName?: any;
  processDefinitionName?: any;
  processDefinitionKey?: any;
  processDefinitionVersion?: any;
  participantVo?: any;
  multiInstance: boolean;
  businessKey?: any;
  wfDefinitionConfigVo?: any;
  wfNodeConfigVo?: any;
}

/**
 * 减签
 */
export interface DeleteMultiInstanceVo {
  id: string;
  name: string;
  assignee: string;
  assigneeName: string;
  processInstanceId: string;
  executionId: string;
}

/**
 * 减签请求参数
 */
export interface DeleteMultiInstanceParams {
  taskId: string;
  taskIds: string[];
  executionIds: string[];
  assigneeIds: string[];
  assigneeNames: string[];
}

/**
 * 加签 请求参数
 */
export interface AddMultiInstanceParams {
  taskId: string;
  assignees: string[];
  assigneeNames: string[];
}
