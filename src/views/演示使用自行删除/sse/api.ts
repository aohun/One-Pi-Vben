import { defHttp } from '@/utils/http/axios';

enum Api {
  status = '/system/sse/status',
  sendAll = '/system/sse/sendAll',
  send = '/system/sse/send',
  list = '/system/sse/list',
}

export function sseStatus() {
  return defHttp.get<boolean>({ url: Api.status });
}

export function sseSendAll(message: string) {
  return defHttp.postWithMsg<void>({ url: Api.sendAll + '?message=' + message });
}

export function sseSendByUserId(userId: string, message: string) {
  return defHttp.postWithMsg<void>({ url: Api.send + `/${userId}?message=${message}` });
}

export function sseList() {
  return defHttp.get<any>({ url: Api.list });
}
