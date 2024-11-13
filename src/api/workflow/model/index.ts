import { defHttp } from '@/utils/http/axios';
import { ID, IDS, PageQuery } from '@/api/base';
import { FlowModel, FlowModelInfo } from './model';

enum Api {
  root = '/workflow/model',
  flowModelInfo = '/workflow/model/getInfo',
  flowModelList = '/workflow/model/list',
  flowModelSave = '/workflow/model/save',
  flowModelUpdate = '/workflow/model/update',
  flowModelDeploy = '/workflow/model/modelDeploy',
  flowModelExportZip = '/workflow/model/export/zip',
  flowModelEditXml = '/workflow/model/editModelXml',
}

export function flowModelList(params?: PageQuery) {
  return defHttp.get<FlowModel[]>({ url: Api.flowModelList, params });
}

export function flowModelInfo(id: ID) {
  return defHttp.get<FlowModelInfo>({ url: Api.flowModelInfo + '/' + id });
}

export function flowModelSave(data: any) {
  return defHttp.postWithMsg<void>({ url: Api.flowModelSave, data });
}

export function flowModelUpdate(data: any) {
  return defHttp.putWithMsg<void>({ url: Api.flowModelUpdate, data });
}

export function flowModelRemove(ids: IDS) {
  return defHttp.deleteWithMsg<void>({ url: `${Api.root}/${ids}` });
}

/**
 * 部署
 */
export function flowModelDeploy(id: ID) {
  return defHttp.postWithMsg<void>({ url: `${Api.flowModelDeploy}/${id}` });
}

/**
 * 导出zip
 */
export function flowModelExportZip(ids: IDS) {
  return defHttp.get<Blob>(
    { url: `${Api.flowModelExportZip}/${ids.join(',')}`, responseType: 'blob' },
    { isTransformResponse: false },
  );
}

/**
 * 设计后保存
 * @param data
 * @returns
 */
export function flowModelEditXml(data: any) {
  return defHttp.putWithMsg<void>({ url: Api.flowModelEditXml, data });
}
