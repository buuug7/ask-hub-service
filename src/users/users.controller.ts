import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('profile/:email')
  async profile(@Param('email') email: string) {
    return this.userService.profile(email);
  }

  @Post()
  async create(@Body() createForm) {
    return this.userService.create(createForm);
  }
}
