import { IDS } from '@/api/base';
import { defHttp } from '@/utils/http/axios';
import { FormConfigInfo } from './model';

export function getInfoById(definitionId: string) {
  return defHttp.get<FormConfigInfo | null>({
    url: '/workflow/definitionConfig/getByDefId/' + definitionId,
  });
}

export function saveOrUpdate(data: any) {
  return defHttp.postWithMsg({ url: '/workflow/definitionConfig/saveOrUpdate', data });
}

export function removeFormConfig(ids: IDS) {
  return defHttp.delete({ url: '/workflow/definitionConfig' + ids.join(',') });
}

/**
 * 查询流程定义配置排除当前查询的流程定义
 * @param tableName
 * @param definitionId
 * @returns
 */
export function getByTableNameNotDefId(tableName: string, definitionId: string) {
  return defHttp.get<any[]>({
    url: `/workflow/definitionConfig/getByTableNameNotDefId/${tableName}/${definitionId}`,
  });
}
