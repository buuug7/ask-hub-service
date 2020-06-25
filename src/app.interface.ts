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
