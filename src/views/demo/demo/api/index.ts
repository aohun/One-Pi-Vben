import { defHttp } from '@/utils/http/axios';
import { ID, IDS, commonExport } from '@/api/base';
import { DemoVO, DemoForm, DemoQuery } from './model';

/**
 * 查询测试单列表
 * @param params
 * @returns
 */
export function demoList(params?: DemoQuery) {
  return defHttp.get<DemoVO[]>({ url: '/demo/demo/list', params });
}

/**
 * 导出测试单列表
 * @param params
 * @returns
 */
export function demoExport(params?: DemoQuery) {
  return commonExport('/demo/demo/export', params ?? {});
}

/**
 * 查询测试单详细
 * @param id id
 * @returns
 */
export function demoInfo(id: ID) {
  return defHttp.get<DemoVO>({ url: '/demo/demo/' + id });
}

/**
 * 新增测试单
 * @param data
 * @returns
 */
export function demoAdd(data: DemoForm) {
  return defHttp.postWithMsg<void>({ url: '/demo/demo', data });
}

/**
 * 更新测试单
 * @param data
 * @returns
 */
export function demoUpdate(data: DemoForm) {
  return defHttp.putWithMsg<void>({ url: '/demo/demo', data });
}

/**
 * 删除测试单
 * @param id id
 * @returns
 */
export function demoRemove(id: ID | IDS) {
  return defHttp.deleteWithMsg<void>({ url: '/demo/demo/' + id });
}
