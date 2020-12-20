export type LoginFrom = {
  github?: string;
  facebook?: string;
  qq?: string;
  wechat?: string;
  weibo?: string;
  alipay?: string;
};

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  active: 0 | 1;
  loginFrom: LoginFrom;
  createdAt: Date;
  updatedAt: Date;
}
