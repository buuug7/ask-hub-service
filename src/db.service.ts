import * as mysql from 'mysql2/promise';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

const config = {
  host: 'localhost',
  user: 'test',
  password: '123456789',
  database: 'ask_hub',
};

@Injectable()
export default class DbService implements OnModuleInit, OnModuleDestroy {
  connection: mysql.Connection;

  async onModuleInit() {
    this.connection = await mysql.createConnection(config);
  }

  onModuleDestroy(): any {
    //
  }
}
