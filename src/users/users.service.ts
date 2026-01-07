import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePassDto } from './dto/update-pass.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // GET ALL USERS
  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  // Get user by ID
  async findOne(id: number): Promise<User | HttpException> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (user) {
        return user;
      } else {
        return new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  // CREATE NEW USER
  async create(user: CreateUserDto): Promise<HttpException> {
    try {
      const findUser = await this.userRepository.findOne({
        where: [{ username: user.username }, { email: user.email }],
      });
      if (findUser) {
        return new HttpException(
          'Username or Email already exists in database',
          HttpStatus.BAD_REQUEST,
        );
      }
      const newUser = this.userRepository.create(user);
      if (newUser) {
        return new HttpException(
          `User ${user.username} created successfully`,
          HttpStatus.CREATED,
        );
      } else {
        throw new Error('Error creating user');
      }
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  // UPDATE USER INFO
  async update(id: number, info: UpdateUserDto): Promise<HttpException> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        return new HttpException('User not found', HttpStatus.NOT_FOUND);
      } else {
        await this.userRepository.update(id, info);
        return new HttpException(
          `User with id ${id} updated successfully`,
          HttpStatus.OK,
        );
      }
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  // UPDATE USER PASSWORD
  async updatePassword(
    id: number,
    passwd: UpdatePassDto,
  ): Promise<HttpException> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        return new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      await this.userRepository.update(id, passwd);
      return new HttpException(
        `Password for user with id ${id} updated successfully`,
        HttpStatus.OK,
      );
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  // DELETE USER
  async remove(id: number): Promise<HttpException> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        return new HttpException('User not found', HttpStatus.NOT_FOUND);
      } else {
        await this.userRepository.delete(id);
        return new HttpException(
          `User with id ${id} deleted successfully`,
          HttpStatus.OK,
        );
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
}
