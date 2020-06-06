import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    nullable: true,
    select: false,
  })
  rememberToken: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  // { github: 'githubId', facebook: 'facebookId', ... }
  // select * from user where email = 'githubEmail@qq.com' and loginFrom -> '$.github' = 'githubId'
  // 如果用户的email等于github返回的email, 并且loginFrom字段存储的github等于github返回过来的ID, 则说明用户已经使用github账户登陆过
  // 直接登陆
  // 否则创建一个新的用户来关联
  @Column({
    type: 'json',
  })
  loginFrom: {
    github?: string;
    facebook?: string;
    qq?: string;
    wechat?: string;
    weibo?: string;
    alipay?: string;
  };
}
