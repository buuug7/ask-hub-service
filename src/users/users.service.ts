import { Injectable } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class UsersService {
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
