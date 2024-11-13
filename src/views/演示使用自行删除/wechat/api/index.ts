import { defHttp } from '@/utils/http/axios';
import { ID, IDS } from '@/api/base';
import { WechatVO, WechatQuery, WechatUploadParam } from './model';
import { ContentTypeEnum } from '@/enums/httpEnum';

/**
 * 查询微信群列表
 * @param params
 * @returns
 */
export function wechatList(params?: WechatQuery) {
  return defHttp.get<WechatVO[]>({ url: '/wechat/list', params });
}

/**
 * 删除微信群
 * @param id id
 * @returns
 */
export function wechatRemove(id: ID | IDS, password: string) {
  return defHttp.postWithMsg<void>({ url: '/wechat/remove/' + id + '?password=' + password });
}

export function wechatUpload(data: WechatUploadParam) {
  return defHttp.postWithMsg<void>({
    url: '/wechat/upload',
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}

export function wechatChangeStatus(data: any, password: string) {
  return defHttp.postWithMsg<void>({ url: '/wechat/changeStatus?password=' + password, data });
}

export function currentGroupImageBase64() {
  return defHttp.get<string>({ url: '/currentGroupImgBase64' });
}

export function refresh() {
  return defHttp.putWithMsg<void>({ url: '/wechat/refresh' });
}
