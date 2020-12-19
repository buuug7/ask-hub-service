export interface Pagination<T> {
  meta: {
    total: number;
    totalPage: number;
    perPage: number;
    currentPage: number;
  };

  data: T[];
}

export interface PaginationParam {
  perPage?: number;
  currentPage?: number;
  search?: QuestionSearchParam;
  // [propName: string]: any;
}

export interface QuestionSearchParam {
  title?: string;
  createdAt?: {
    op?: string;
    value: string;
  };
  updatedAt?: {
    op?: string;
    value: string;
  };
  username?: string;
}

// { github: 'githubId', facebook: 'facebookId', ... }
// select * from user where email = 'githubEmail@qq.com' and loginFrom -> '$.github' = 'githubId'
// 如果用户的email等于github返回的email, 并且loginFrom字段存储的github等于github返回过来的ID, 则说明用户已经使用github账户登陆过
// 直接登陆
// 否则创建一个新的用户来关联
export interface LoginFrom {
  github?: string;
  facebook?: string;
  qq?: string;
  wechat?: string;
  weibo?: string;
  alipay?: string;
}
