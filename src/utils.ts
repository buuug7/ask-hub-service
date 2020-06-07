import { BaseEntity, SelectQueryBuilder } from 'typeorm';

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

export interface PaginationParam {
  per?: number;
  current?: number;
  search?: QuestionSearchParam;
  [propName: string]: any;
}

export async function simplePagination(
  selectQueryBuilder: SelectQueryBuilder<BaseEntity>,
  param: PaginationParam,
) {
  let { per = 10, current = 1 } = param;

  per = parseInt(String(per), 10);
  current = parseInt(String(current), 10);

  const total = await selectQueryBuilder.getCount();

  if (per <= 0) {
    per = 1;
  }

  const totalPage =
    total % per === 0 ? total / per : parseInt(String(total / per), 10) + 1;

  if (current >= totalPage) {
    current = totalPage;
  }

  if (current <= 0) {
    current = 1;
  }

  console.log('totalPage', totalPage);
  console.log('current', current);

  const data = await selectQueryBuilder
    .skip(per * (current - 1))
    .take(per)
    .getMany();

  return {
    total,
    totalPage,
    per,
    current,
    data,
  };
}
