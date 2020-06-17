import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UserCreateDto } from './users.dto';
import { hashSync } from 'bcrypt';

@Injectable()
export class UsersService {
  async create(data: UserCreateDto) {
    const exists = await this.findByEmail(data.email);

    if (exists) {
      throw new HttpException(
        {
          message: 'an email is already exists',
        },
        HttpStatus.CONFLICT,
      );
    }

    const instance = await User.save(
      User.create({
        ...data,
        password: hashSync(data.password, 3),
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
