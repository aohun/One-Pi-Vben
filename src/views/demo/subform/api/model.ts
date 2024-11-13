import { BaseEntity, PageQuery } from '@/api/base';

export interface PurchaseVO {
  /**
   * 主键
   */
  id: string | number;

  /**
   * 部门id
   */
  deptId: string | number;

  /**
   * 用户id
   */
  userId: string | number;

  /**
   * 采购标题
   */
  name: string;

  /**
   * 备注
   */
  notes: string;

  /**
   * 子表单  名称 数量 单价  总价
   */
  subForm: string;
  processInstanceVo?: any;
}

export interface PurchaseForm extends BaseEntity {
  /**
   * 主键
   */
  id?: string | number;

  /**
   * 部门id
   */
  deptId?: string | number;

  /**
   * 用户id
   */
  userId?: string | number;

  /**
   * 采购标题
   */
  name?: string;

  /**
   * 备注
   */
  notes?: string;

  /**
   * 子表单  名称 数量 单价  总价
   */
  subForm?: string;
}

export interface PurchaseQuery extends PageQuery {
  /**
   * 部门id
   */
  deptId?: string | number;

  /**
   * 用户id
   */
  userId?: string | number;

  /**
   * 采购标题
   */
  name?: string;

  /**
   * 备注
   */
  notes?: string;

  /**
   * 子表单  名称 数量 单价  总价
   */
  subForm?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
