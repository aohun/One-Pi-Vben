import { authBinding } from '@/api/auth';
/**
 * @description: 菜单
 * @param key key
 * @param title 标题
 * @param description 描述
 * @param extra 按钮文字
 * @param avatar 图标
 * @param color 图标颜色可直接写英文颜色/hex
 */
export interface ListItem {
  key: string;
  title: string;
  description: string;
  extra?: string;
  avatar?: string;
  color?: string;
}

/**
 * @description: 绑定账号
 * @param source 来源 如gitee github 与后端的social-callback?source=xxx对应
 * @param bound 是否已经绑定
 * @param action 账号绑定回调
 */
export interface BindItem extends ListItem {
  source: string;
  bound?: boolean;
  action?: (source: string) => Promise<any>;
}

/**
 * todo tenantId
 * 绑定授权从userStore.userInfo获取
 * 登录从localStorage获取
 * @param source
 */
async function handleAuthBinding(source: string) {
  const tenantId = localStorage.getItem('tenantId') ?? '000000';
  // 这里返回打开授权页面的链接
  const href = await authBinding(source, tenantId);
  window.location.href = href;
}

/**
 * 账号绑定 list
 * 添加账号绑定只需要在这里增加即可
 * 添加过的项目会在个人主页-绑定账号中显示
 * action不为空的会在登录页显示
 */
export const accountBindList: BindItem[] = [
  {
    key: '1',
    source: 'taobao',
    title: '淘宝',
    description: '绑定淘宝账号',
    avatar: 'ri:taobao-fill',
    color: '#ff4000',
  },
  {
    key: '2',
    source: 'alipay',
    title: '支付宝',
    description: '绑定支付宝账号',
    avatar: 'fa-brands:alipay',
    color: '#2eabff',
  },
  {
    key: '3',
    source: 'ding',
    title: '钉钉',
    description: '绑定钉钉账号',
    avatar: 'ri:dingding-fill',
    color: '#2eabff',
  },
  {
    key: '4',
    source: 'gitee',
    title: 'GITEE',
    description: '绑定GITEE账号',
    avatar: 'simple-icons:gitee',
    color: '#c71d23',
    action: () => handleAuthBinding('gitee'),
  },
  {
    key: '5',
    source: 'github',
    title: 'GITHUB',
    description: '绑定GITHUB账号',
    avatar: 'uiw:github',
    color: '',
    action: () => handleAuthBinding('github'),
  },
];
