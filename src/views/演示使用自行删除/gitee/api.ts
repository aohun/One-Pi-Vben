import { defHttp } from '@/utils/http/axios';

export interface GiteeData {
  date: string;
  count: number;
}

export interface GiteeResponse {
  starList: GiteeData[];
  forkList: GiteeData[];
}

export function giteeRecord() {
  return defHttp.get<GiteeResponse>({ url: '/gitee/record' });
}
