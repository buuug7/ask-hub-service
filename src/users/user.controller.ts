import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('email/:email')
  @UseGuards(AuthGuard('jwt'))
  async findByEmail(@Param('email') email: string) {
    console.log('email', email);
    return this.userService.findByEmail(email);
  }
}
