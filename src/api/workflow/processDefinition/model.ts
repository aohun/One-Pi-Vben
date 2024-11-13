export interface ProcessDefinition {
  id: string;
  name: string;
  key: string;
  version: number;
  suspensionState: number;
  resourceName: string;
  diagramResourceName: string;
  deploymentId: string;
  deploymentTime: string;
}

/**
 * xml换行
 * xmlStr不换行
 */
export interface XmlResponse {
  xml: string;
  xmlStr: string;
}
