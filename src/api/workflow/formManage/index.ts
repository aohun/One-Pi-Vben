import { ID, IDS, PageQuery, commonExport } from '@/api/base';
import { defHttp } from '@/utils/http/axios';
import { WfFormOption } from './model';

enum Api {
  root = '/workflow/formManage',
  list = '/workflow/formManage/list',
  selectList = '/workflow/formManage/selectList',
  export = '/workflow/formManage/export',
}

export function wfFormManageList(params?: PageQuery) {
  return defHttp.get({ url: '/workflow/formManage/list', params });
}

export function wfFormManageSelectList() {
  return defHttp.get<WfFormOption[]>({ url: '/workflow/formManage/list/selectList' });
}

export function wfFormManageExport(data: any) {
  return commonExport(Api.export, data);
}

export function wfFormManageInfo(id: ID) {
  return defHttp.get({ url: `${Api.root}/${id}` });
}

export function wfFormManageAdd(data: any) {
  return defHttp.postWithMsg<void>({ url: `${Api.root}`, data });
}

export function wfFormManageUpdate(data: any) {
  return defHttp.putWithMsg<void>({ url: `${Api.root}`, data });
}

export function wfFormManageRemove(ids: IDS) {
  return defHttp.deleteWithMsg<void>({ url: `${Api.root}/${ids.join(',')}` });
}
