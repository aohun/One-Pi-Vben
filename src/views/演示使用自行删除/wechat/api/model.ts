import { BaseEntity, PageQuery } from '@/api/base';

export interface WechatVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 状态（0正常 1停用）
   */
  status: string;

  /**
   * 图片地址
   */
  groupImg: string;
}

export interface WechatForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 状态（0正常 1停用）
   */
  status?: string;

  /**
   * 图片地址
   */
  groupImg?: string;
}

export interface WechatQuery extends PageQuery {
  /**
   * 状态（0正常 1停用）
   */
  status?: string;

  /**
   * 图片地址
   */
  groupImg?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}

export interface WechatUploadParam {
  file: File | Blob;
  password: string;
}
