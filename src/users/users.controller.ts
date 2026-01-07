import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePassDto } from './dto/update-pass.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET ALL USERS
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  getAllUsers() {
    return this.usersService.findAll();
  }

  // GET USER BY ID
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.findOne(id);
  }

  // CREATE NEW USER
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  createUser(@Body() newUser: CreateUserDto) {
    return this.usersService.create(newUser);
  }

  // UPDATE USER INFO
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('update')
  async updateUser(
    @Query('id', ParseIntPipe) id: number,
    @Body() updatedUser: UpdateUserDto,
  ) {
    return await this.usersService.update(id, updatedUser);
  }

  // UPDATE USER PASSWORD
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('update-pass')
  async updateUserPassword(
    @Query('id', ParseIntPipe) id: number,
    @Body('password') password: UpdatePassDto['password'],
  ) {
    return await this.usersService.updatePassword(id, { password });
  }

  // DELETE USER
  @UseInterceptors(ClassSerializerInterceptor)
  @Delete('delete')
  async deleteUser(@Query('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
  }
}
