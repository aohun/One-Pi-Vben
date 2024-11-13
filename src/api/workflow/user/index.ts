import { IDS, PageQuery } from '@/api/base';
import { defHttp } from '@/utils/http/axios';
import type { WorkFlowUser } from './model';

enum Api {
  root = '/workflow/user',
  getPageByAddMultiInstance = '/workflow/user/getPageByAddMultiInstance',
  getListByDeleteMultiInstance = '/workflow/user/getListByDeleteMultiInstance',
  getUserListByIds = '/workflow/user/getUserListByIds',
  getPageByUserList = '/workflow/user/getPageByUserList',
}

/**
 * 页查询工作流选择加签人员
 * @param params
 * @returns
 */
export function getPageByAddMultiInstance(params?: PageQuery) {
  return defHttp.get<WorkFlowUser[]>({ url: Api.getPageByAddMultiInstance, params });
}

/**
 * 查询工作流选择减签人员
 * @param taskId
 * @returns
 */
export function getListByDeleteMultiInstance(taskId: string) {
  return defHttp.get({ url: Api.getListByDeleteMultiInstance + '/' + taskId });
}

/**
 * getUserListByIds
 * @param userIds
 * @returns
 */
export function getUserListByIds(userIds: IDS) {
  return defHttp.get<WorkFlowUser[]>({ url: `${Api.getUserListByIds}/${userIds.join(',')}` });
}

export function getPageByUserList(params: PageQuery) {
  return defHttp.get<WorkFlowUser[]>(
    { url: Api.getPageByUserList, params },
    { ignoreCancelToken: true },
  );
}
