# Ask Hub Service

An application where collect and share ask/answer questions. use node nest framework.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## 权限 TODO

- 更新资源时判定权限
  - 当资源的创建者 ID 跟用户 ID 相等
- 删除资源
  - 当资源的创建者 ID 跟用户 ID 相等
  - 当前用户具有 admin 角色
