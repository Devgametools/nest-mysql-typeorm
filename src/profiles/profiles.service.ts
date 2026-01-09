import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profiles.entity';
import { User } from '../users/user.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
      @InjectRepository(Profile)
      private profileRepository: Repository<Profile>,
      @InjectRepository(User)
      private userRepository: Repository<User>,
    ) {}

  // GET ALL PROFILES
  async findAll(): Promise<Profile[]> {
    try {
      return await this.profileRepository.find();
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  // Get profile by ID
  async findOne(id: number): Promise<Profile | HttpException> {
    try {
      const profile = await this.profileRepository.findOne({ where: { userId: id } });
      if (!profile) {
        return new HttpException('Profile not found', HttpStatus.NOT_FOUND);
      } else {
        return profile;
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  // CREATE NEW PROFILE
  async create(id: number, profileData: CreateProfileDto): Promise<HttpException> {
    try {
      const user = await this.userRepository.findOne({ where: { id: id } });
      if (!user) {
        return new HttpException('User not found', HttpStatus.BAD_REQUEST);
      } else {
        const newProfile = this.profileRepository.create(profileData);
        const savedProfile = await this.profileRepository.save(newProfile);
        user.profile = savedProfile;
        await this.userRepository.save(user);
        return new HttpException(
          `Profile for user ID ${id} created successfully`,
          HttpStatus.CREATED,
        );
      }
      
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  // UPDATE PROFILE
  async update(id: number, updateData: UpdateProfileDto): Promise<HttpException> {
    try {
      const profile = await this.profileRepository.findOne({ where: { userId: id } });
      if (!profile) {
        return new HttpException('Profile not found', HttpStatus.NOT_FOUND);
      }
      Object.assign(profile, updateData);
      await this.profileRepository.save(profile);
      return new HttpException(
        `Profile with ID ${id} updated successfully`,
        HttpStatus.OK,
      );
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  } 

  // DELETE PROFILE
  async delete(id: number): Promise<HttpException> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: id },
        relations: ['profile'],
      });
      if (!user) {
        return new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      await this.userRepository.delete(id);
      return new HttpException(
        `Profile and User with ID ${id} deleted successfully`,
        HttpStatus.OK,
      );
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
}
