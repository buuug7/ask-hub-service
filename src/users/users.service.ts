import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './users.type';
import { hashSync } from 'bcrypt';
import { DbService } from '../db.service';
import * as dayjs from 'dayjs';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { ResultSetHeader } from 'mysql2';

@Injectable()
export class UsersService {
  constructor(private dbService: DbService) {}

  async create(data: Partial<User>) {
    const exists = await this.findByEmail(data.email);

    if (exists) {
      throw new HttpException(
        {
          message: 'an email is already exists',
        },
        HttpStatus.CONFLICT,
      );
    }

    const sql = `insert into users(id, name, email, password, active, loginFrom, createdAt, updatedAt)
                 values (?, ?, ?, ?, ?, ?, ?, ?)`;
    const dateTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const rs = await this.dbService.execute<ResultSetHeader>(sql, [
      randomStringGenerator(),
      data.name,
      data.email,
      hashSync(data.password, 3),
      '1',
      JSON.stringify({}),
      dateTime,
      dateTime,
    ]);

    return this.getProfile(data.email);
  }

  async update(id: string, data: { name: string }) {
    const sql = `update users set name = ? where id = ?`;
    const rs = await this.dbService.execute<ResultSetHeader>(sql, [
      data.name,
      id,
    ]);

    const user = await this.findById(id);
    return this.mapDatabaseUserToUserProfile(user);
  }

  async findById(id: string) {
    const sql = `select *
                 from users
                 where id = ?
                 limit 1`;
    const rs = await this.dbService.execute<User[]>(sql, [id]);

    if (rs.length <= 0) {
      return null;
    }
    return rs[0];
  }

  async findByEmail(email: string) {
    const sql = `select *
                 from users
                 where email = ?
                 limit 1`;
    const rs = await this.dbService.execute<User[]>(sql, [email]);

    if (rs.length <= 0) {
      return null;
    }
    return rs[0];
  }

  async getProfile(email: string) {
    const user = await this.findByEmail(email);
    return this.mapDatabaseUserToUserProfile(user);
  }

  /**
   * 数据库user数据映射部分字段为用户资料，返回给前端
   * @param user
   */
  mapDatabaseUserToUserProfile(user: User): Partial<User> {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      active: user.active,
      createdAt: user.createdAt,
    };
  }
}
