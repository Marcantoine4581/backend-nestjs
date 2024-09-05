import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './users.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Get()
    getUsers() {
      return this.userService.getUsers();
    }

    @Get('/:userId')
    getOneUser(@Param('userId') userId: string) {
      return this.userService.getOneUser({
        userId,
    });
    }
}
