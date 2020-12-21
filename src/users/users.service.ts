import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './users.type';
import { hashSync } from 'bcrypt';
import DbService from '../db.service';
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

    const sql = `insert into users(id,name, email, password, active, loginFrom, createdAt, updatedAt) values (?,?,?,?,?,?,?,?)`;
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

    return this.profile(data.email);
  }

  async findById(id: string) {
    const sql = `select * from users where id = ? limit 1`;
    const rs = await this.dbService.execute<User[]>(sql, [id]);

    if (rs.length <= 0) {
      return null;
    }
    return rs[0];
  }

  async findByEmail(email: string) {
    const sql = `select * from users where email = ? limit 1`;
    const rs = await this.dbService.execute<User[]>(sql, [email]);

    if (rs.length <= 0) {
      return null;
    }
    return rs[0];
  }

  async profile(email: string): Promise<Partial<User>> {
    const user = await this.findByEmail(email);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      active: user.active,
      createdAt: user.createdAt,
    };
  }
}
