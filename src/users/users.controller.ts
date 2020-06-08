import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('profile/:email')
  @UseGuards(AuthGuard('jwt'))
  async profile(@Param('email') email: string) {
    return this.userService.profile(email);
  }
}
