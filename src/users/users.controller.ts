import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('profile/:email')
  @UseGuards(AuthGuard('jwt'))
  async profile(@Param('email') email: string) {
    console.log('email', email);
    return this.userService.findByEmail(email);
  }
}
