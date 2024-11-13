import { defHttp } from '@/utils/http/axios';

export interface Temp {
  name: string;
  value: number;
}

export function visitList() {
  return defHttp.get<Temp[]>({ url: '/monitor/logininfor/visitsMap' });
}

export function deviceInfoList() {
  return defHttp.get<Temp[]>({ url: '/monitor/logininfor/deviceInfoList' });
}

export function browserInfoList() {
  return defHttp.get<Temp[]>({ url: '/monitor/logininfor/browserInfoList' });
}

export function ispInfoList() {
  return defHttp.get<Temp[]>({ url: '/monitor/logininfor/ispInfoList' });
}

export interface LoginLineResp {
  date: string[];
  fail: number[];
  success: number[];
}

export function loginLine() {
  return defHttp.get<LoginLineResp>({ url: '/monitor/logininfor/loginLine' });
}
