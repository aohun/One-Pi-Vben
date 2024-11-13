import { defHttp } from '@/utils/http/axios';
import {
  TenantResp,
  LoginParams,
  OAuthLoginParams,
  LoginResult,
  UserInfoResult,
  Menu,
} from './model';
import { ErrorMessageMode } from '#/axios';
import { useGlobSetting } from '@/hooks/setting';

enum Api {
  Login = '/auth/login',
  Logout = '/auth/logout',
  TenantList = '/auth/tenant/list',
  authBinding = '/auth/binding',
  authUnbinding = '/auth/unlock',
  authCallback = '/auth/social/callback',
  GetUserInfo = '/system/user/getInfo',
  GetRoutes = '/system/menu/getRouters',
  SSEClose = '/resource/sse/close',
}

/**
 * 获取租户列表 下拉框使用
 */
export function tenantList() {
  return defHttp.get<TenantResp>({ url: Api.TenantList }, { ignoreCancelToken: true });
}

const globSetting = useGlobSetting();
/**
 * @description 登录接口 可处理普通登录和oauth登录
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResult>(
    {
      url: Api.Login,
      params: {
        ...params,
        clientId: globSetting.clientId,
      },
    },
    {
      errorMessageMode: mode,
      encrypt: true,
    },
  );
}

/**
 * @description: 获取用户信息
 */
export function getUserInfo() {
  return defHttp.get<UserInfoResult>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' });
}

/**
 * 绑定第三方账号
 * @param source 绑定的来源
 * @returns 跳转url
 */
export function authBinding(source: string, tenantId: string) {
  return defHttp.get<string>({
    url: Api.authBinding + '/' + source,
    params: {
      tenantId,
      domain: window.location.host,
    },
  });
}

/**
 * 取消绑定
 * @param id 数据库id
 */
export function authUnbinding(id: string) {
  return defHttp.deleteWithMsg<void>({ url: Api.authUnbinding + '/' + id });
}

/**
 * oauth授权回调
 * @param data oauth授权
 * @returns
 */
export function authCallback(data: OAuthLoginParams) {
  return defHttp.post<void>({ url: Api.authCallback, data });
}

/**
 * 用户登出
 * @returns
 */
export function doLogout() {
  return defHttp.post<void>({ url: Api.Logout });
}

/**
 * 获取对应用户的菜单
 * @returns
 */
export function getRoutes() {
  return defHttp.get<Menu[]>({ url: Api.GetRoutes });
}

/**
 * 登出时关闭sse
 * @returns sse关闭
 */
export function sseClose() {
  return defHttp.get<void>({ url: Api.SSEClose });
}
