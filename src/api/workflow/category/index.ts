import { defHttp } from '@/utils/http/axios';
import { ID, IDS, PageQuery, commonExport } from '@/api/base';
import { Category } from './model';

enum Api {
  root = '/workflow/category',
  categoryList = '/workflow/category/list',
  categoryExport = '/workflow/category/export',
}

export function categoryList(params?: PageQuery) {
  return defHttp.get<Category[]>({ url: Api.categoryList, params });
}

export function categoryInfo(id: ID) {
  return defHttp.get<Category>({ url: Api.root + '/' + id });
}

export function categoryAdd(data: any) {
  return defHttp.postWithMsg<void>({ url: Api.root, data });
}

export function categoryUpdate(data: any) {
  return defHttp.putWithMsg<void>({ url: Api.root, data });
}

export function categoryRemove(ids: IDS) {
  return defHttp.deleteWithMsg<void>({ url: `${Api.root}/${ids}` });
}

export function categoryExport(data: any) {
  return commonExport(Api.categoryExport, data);
}
