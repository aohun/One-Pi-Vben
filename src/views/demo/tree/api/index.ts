import { defHttp } from '@/utils/http/axios';
import { ID, IDS } from '@/api/base';
import { TreeVO, TreeForm, TreeQuery } from './model';

/**
 * 查询测试树列表
 * @param params
 * @returns
 */
export function treeList(params?: TreeQuery) {
  return defHttp.get<TreeVO[]>({ url: '/demo/tree/list', params });
}

/**
 * 导出测试树列表
 * @param params
 * @returns
 */
export function treeExport(params?: TreeQuery) {
  return defHttp.post<Blob>(
    { url: '/demo/tree/export', params, responseType: 'blob' },
    { isTransformResponse: false },
  );
}

/**
 * 查询测试树详细
 * @param id id
 * @returns
 */
export function treeInfo(id: ID) {
  return defHttp.get<TreeVO>({ url: '/demo/tree/' + id });
}

/**
 * 新增测试树
 * @param data
 * @returns
 */
export function treeAdd(data: TreeForm) {
  return defHttp.postWithMsg<void>({ url: '/demo/tree', data });
}

/**
 * 更新测试树
 * @param data
 * @returns
 */
export function treeUpdate(data: TreeForm) {
  return defHttp.putWithMsg<void>({ url: '/demo/tree', data });
}

/**
 * 删除测试树
 * @param id id
 * @returns
 */
export function treeRemove(id: ID | IDS) {
  return defHttp.deleteWithMsg<void>({ url: '/demo/tree/' + id });
}
