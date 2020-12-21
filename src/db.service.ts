import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Connection, createConnection, RowDataPacket } from 'mysql2/promise';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DbService implements OnModuleInit, OnModuleDestroy {
  conn: Connection;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.conn = await createConnection({
      host: this.configService.get('database.host'),
      user: this.configService.get('database.user'),
      password: this.configService.get('database.password'),
      database: this.configService.get('database.dbname'),
      // debug: true
    });
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
