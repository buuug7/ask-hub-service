import { BaseEntity, SelectQueryBuilder } from 'typeorm';
import { ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { Pagination, PaginationParam } from './app.interface';
import { User } from './users/user.entity';
import { Question } from './questions/question.entity';
import { Answer } from './answers/answer.entity';

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
    .offset(perPage * (currentPage - 1))
    .limit(perPage)
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

export const PERMISSIONS = [
  'questions:delete',
  'questions:update',
  'answers:delete',
  'answers:update',
  'tags:delete',
  'tags:update',
];

/**
 * determine whether a user is admin user
 * @param user
 */
export function isAdmin(user: Partial<User>) {
  // TODO
  return user.name === 'ask@dev.com';
}

/**
 * determine whether the user have the permission of resource
 * @param user
 * @param resource
 */
export function havePermissionOf<
  T extends Question | Answer,
  U extends Partial<User>
>(resource: T, user: U): boolean {
  // if (isAdmin(user)) {
  //   return true;
  // }
  return resource.user.id === user.id;
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

/**
 * throw exception if give user don't have enough permission
 * @param resource
 * @param user
 */
export function checkPermission<
  T extends Question | Answer,
  U extends Partial<User>
>(resource: T, user: U) {
  if (!havePermissionOf(resource, user)) {
    throw new ForbiddenException("you don't have enough permission");
  }
}
