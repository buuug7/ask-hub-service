module.exports =   {
  name: 'default',
  type: 'mysql',
  host: '172.27.24.230',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'ask_hub',
  synchronize: true,
  logging: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'dist/**/*.entity{.ts,.js}',
    migrationsDir: 'src/migration/**/*.ts',
    subscribersDir: 'src/subscriber/**/*.ts',
  },
  seeds: ['dist/seeds/**/*.seed.ts'],
  factories: ['src/factories/**/*.factory.ts'],
};