module.exports = {
  name: 'default',
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'test',
  password: '123456789',
  database: 'ask_hub_typeorm',
  synchronize: false,
  logging: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['migration/*.js'],
  cli: {
    entitiesDir: 'dist/**/*.entity{.ts,.js}',
    migrationsDir: 'migration',
  },
};
