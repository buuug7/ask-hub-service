import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Connection, createConnection, RowDataPacket } from 'mysql2/promise';

const config = {
  host: 'localhost',
  user: 'test',
  password: '123456789',
  database: 'ask_hub',
};

@Injectable()
export default class DbService implements OnModuleInit, OnModuleDestroy {
  conn: Connection;

  async onModuleInit() {
    this.conn = await createConnection(config);
  }

  async execute<T>(sql: string, values: string[] = []) {
    console.log('sql: ', this.conn.format(sql));
    console.log('sql param: ', values);
    const [rows] = await this.conn.execute(sql, values);
    return (rows as unknown) as T;
  }

  onModuleDestroy(): any {
    //
  }
}
