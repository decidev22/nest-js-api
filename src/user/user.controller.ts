import { Controller, Get, UseGuards, Req, Patch, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { JWTGuard } from '../auth/guard/jwt.guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JWTGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetUser() user: User) {
    //Prisma User type
    // console.log({
    //     user: req.user,
    // });
    return user;
  }

  @Patch()
  editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }
}
