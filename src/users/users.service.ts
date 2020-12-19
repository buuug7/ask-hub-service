import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserCreateDto } from './users.dto';
import { hashSync } from 'bcrypt';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

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

    const instance = await this.prismaService.user.create({
      data: {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
        password: hashSync(data.password, 3),
      },
    });

    return this.profile(instance.email);
  }

  async findByEmail(email: string) {
    return await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async profile(email: string) {
    return await this.prismaService.user.findUnique({
      where: { email: email },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
  }
}
