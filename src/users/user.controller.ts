import { Controller, Get, Param, Req } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('email/:email')
  async findByEmail(@Param('email') email: string) {
    console.log('email', email)
    return this.userService.findByEmail(email);
  }
}
