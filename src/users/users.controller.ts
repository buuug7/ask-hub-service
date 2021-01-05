import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('profile/:email')
  async profile(@Param('email') email: string) {
    return this.userService.getProfile(email);
  }

  @Post()
  async create(@Body() body) {
    return this.userService.create(body);
  }

  @Post(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id') id, @Body() body) {
    return this.userService.update(id, body);
  }
}
