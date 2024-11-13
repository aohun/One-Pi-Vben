import { defHttp } from '@/utils/http/axios';
import { ID, IDS } from '@/api/base';
import { PurchaseVO, PurchaseForm, PurchaseQuery } from './model';

/**
 * 查询采购申请列表
 * @param params
 * @returns
 */
export function purchaseList(params?: PurchaseQuery) {
  return defHttp.get<PurchaseVO[]>({ url: '/demo/purchase/list', params });
}

/**
 * 导出采购申请列表
 * @param params
 * @returns
 */
export function purchaseExport(params?: PurchaseQuery) {
  return defHttp.post<Blob>(
    { url: '/demo/purchase/export', params, responseType: 'blob' },
    { isTransformResponse: false },
  );
}

/**
 * 查询采购申请详细
 * @param id id
 * @returns
 */
export function purchaseInfo(id: ID) {
  return defHttp.get<PurchaseVO>({ url: '/demo/purchase/' + id });
}

/**
 * 新增采购申请
 * @param data
 * @returns
 */
export function purchaseAdd(data: PurchaseForm) {
  return defHttp.postWithMsg<PurchaseVO>({ url: '/demo/purchase', data });
}

/**
 * 更新采购申请
 * @param data
 * @returns
 */
export function purchaseUpdate(data: PurchaseForm) {
  return defHttp.putWithMsg<PurchaseVO>({ url: '/demo/purchase', data });
}

/**
 * 删除采购申请
 * @param id id
 * @returns
 */
export function purchaseRemove(id: ID | IDS) {
  return defHttp.deleteWithMsg<void>({ url: '/demo/purchase/' + id });
}
