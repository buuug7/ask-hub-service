import { BaseEntity, SelectQueryBuilder } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Pagination, PaginationParam } from './app.interface';

export async function simplePagination<T>(
  selectQueryBuilder: SelectQueryBuilder<BaseEntity | any>,
  param: PaginationParam,
): Promise<Pagination<T>> {
  let { perPage = 10, currentPage = 1 } = param;

  perPage = parseInt(String(perPage), 10);
  currentPage = parseInt(String(currentPage), 10);

  const total = await selectQueryBuilder.getCount();

  if (perPage <= 0) {
    perPage = 1;
  }

  const totalPage =
    total % perPage === 0
      ? total / perPage
      : parseInt(String(total / perPage), 10) + 1;

  if (currentPage >= totalPage) {
    currentPage = totalPage;
  }

  if (currentPage <= 0) {
    currentPage = 1;
  }

  console.log('totalPage', totalPage);
  console.log('current', currentPage);

  const data = await selectQueryBuilder
    .skip(perPage * (currentPage - 1))
    .take(perPage)
    .getMany();

  return {
    meta: {
      total,
      totalPage,
      perPage,
      currentPage,
    },
    data: data,
  };
}

/**
 * throw a exception if give resource is not found
 * @param resource
 * @param type
 */
export function checkResource<T>(resource: T, type?: any) {
  if (resource === undefined) {
    throw new HttpException(
      {
        message: `The resource with **${type.constructor.name}** is not found`,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
