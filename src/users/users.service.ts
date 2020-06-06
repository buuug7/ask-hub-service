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
}
