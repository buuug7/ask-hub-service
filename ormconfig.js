module.exports = {
  name: 'default',
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'ask_hub',
  synchronize: true,
  logging: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['migration/*.js'],
  cli: {
    entitiesDir: 'dist/**/*.entity{.ts,.js}',
    migrationsDir: 'migration',
  },
};
