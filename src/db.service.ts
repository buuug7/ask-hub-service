import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Connection, createConnection } from 'mysql2/promise';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DbService implements OnModuleInit, OnModuleDestroy {
  conn: Connection;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.conn = await createConnection({
      host: this.configService.get('DB_HOST'),
      user: this.configService.get('DB_USER'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_DATABASE'),
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
