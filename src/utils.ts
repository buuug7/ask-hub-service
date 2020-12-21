import { ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { Pagination, PaginationParam } from './app.type';
import { DbService } from './db.service';
import { Question } from './questions/questions.type';
import { User } from './users/users.type';
import { Answer } from './answers/answers.type';

export async function simplePagination<T>(
  dbService: DbService,
  tableName,
  param: PaginationParam,
) {
  let { perPage = 10, currentPage = 1 } = param;

  perPage = parseInt(String(perPage), 10);
  currentPage = parseInt(String(currentPage), 10);

  const [{ total }] = await dbService.execute(
    `select count(*) as total from ${tableName}`,
  );

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

  let sql = `select * from ${tableName}`;

  if (param.search) {
    // TODO
  }

  sql += ` order by createdAt desc`;
  sql += ` limit ${perPage * (currentPage - 1)}, ${perPage}`;

  const values = [];

  const data = await dbService.execute<T[]>(sql, values);

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

export const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';
