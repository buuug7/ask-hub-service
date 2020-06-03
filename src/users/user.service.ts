import { Injectable } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class UserService {
  async findByEmail(email: string): Promise<User> {
    return await User.findOne({
      where: {
        email: email,
      },
    });
  }
}
