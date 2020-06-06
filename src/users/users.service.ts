import { Injectable } from '@nestjs/common';
import { Users } from './users.entity';

@Injectable()
export class UsersService {
  async findByEmail(email: string): Promise<Users> {
    return await Users.findOne({
      where: {
        email: email,
      },
    });
  }
}
