import { defHttp } from '@/utils/http/axios';
import { ID, IDS, PageQuery, commonExport } from '@/api/base';
import { Client } from './model';

enum Api {
  root = '/system/client',
  clientList = '/system/client/list',
  clientExport = '/system/client/export',
  clientChangeStatus = '/system/client/changeStatus',
}

export function clientList(params?: PageQuery) {
  return defHttp.get<Client[]>({ url: Api.clientList, params });
}

export function clientExport(data: any) {
  return commonExport(Api.clientExport, data);
}

export function clientInfo(id: ID) {
  return defHttp.get<Client>({ url: Api.root + '/' + id });
}

export function clientAdd(data: any) {
  return defHttp.postWithMsg<void>({ url: Api.root, data });
}

export function clientUpdate(data: any) {
  return defHttp.putWithMsg<void>({ url: Api.root, data });
}

export function clientChangeStatus(data: any) {
  return defHttp.putWithMsg<void>({ url: Api.root, data });
}

export function clientRemove(ids: IDS) {
  return defHttp.deleteWithMsg({ url: Api.root + '/' + ids });
}
