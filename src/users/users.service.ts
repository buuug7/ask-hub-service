import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UserCreateDto } from './users.dto';

@Injectable()
export class UsersService {
  async create(data: UserCreateDto) {
    const instance = await User.save(
      User.create({
        ...data,
        // password: 'fuck',
        active: true,
      }),
    );

    return this.profile(instance.email);
  }

  async findByEmail(email: string): Promise<User> {
    return await User.findOne({
      where: {
        email: email,
      },
    });
  }

  async profile(email: string): Promise<Partial<User>> {
    const rs = await User.findOne({
      where: { email: email },
      select: ['id', 'name', 'email', 'createdAt'],
    });

    return rs;
  }
}
