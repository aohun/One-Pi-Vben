export interface WorkFlowUser {
  userId: number;
  tenantId: string;
  deptId: number;
  userName: string;
  nickName: string;
  userType: string;
  email: string;
  phonenumber: string;
  sex: string;
  avatar?: any;
  status: string;
  loginIp: string;
  loginDate: string;
  remark: string;
  createTime: string;
  deptName: string;
  roles?: any;
  roleIds?: any;
  postIds?: any;
  roleId?: any;
}
