import { ID, IDS, PageQuery, commonExport } from '@/api/base';
import { defHttp } from '@/utils/http/axios';
import { Dayjs } from 'dayjs';

enum Api {
  root = '/workflow/leave',
  list = '/workflow/leave/list',
  export = '/workflow/leave/export',
}

export interface Leave {
  id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  leaveDays: number;
  remark: string;
  processInstanceVo?: any;
  dateTime?: [string, string] | [Dayjs, Dayjs];
}

export interface Resp {
  createDept: number;
  createBy: number;
  createTime: string;
  updateBy: number;
  updateTime: string;
  id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  leaveDays: number;
  remark?: any;
}

export function list(params?: PageQuery) {
  return defHttp.get<Leave[]>({ url: Api.list, params });
}

export function exportExcel(data: any) {
  return commonExport(Api.export, data);
}

export function getInfo(id: ID) {
  return defHttp.get<Leave>({ url: `${Api.root}/${id}` });
}

export function add(data: any) {
  return defHttp.post<Resp>({ url: Api.root, data });
}

export function update(data: any) {
  return defHttp.put<Resp>({ url: Api.root, data });
}

export function removeByIds(ids: IDS) {
  return defHttp.deleteWithMsg<void>({ url: `${Api.root}/${ids.join(',')}` });
}
