import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './posts.entity';
import { UsersService } from '../users/users.service';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
    private usersService: UsersService,
  ) {}

  // GET ALL POSTS
  async findAll(): Promise<Post[] | HttpException> {
    try {
      const posts = await this.postsRepository.find({ relations: ['user'] });
      if (!posts) {
        return new HttpException('No posts found', HttpStatus.NOT_FOUND);
      } else {
        return posts;
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  // GET POST BY ID
  async findOne(id: number): Promise<Post | HttpException> {
    try {
      const post = await this.postsRepository.findOne({
        where: { id },
        relations: ['user'],
      });
      if (!post) {
        return new HttpException('Post not found', HttpStatus.NOT_FOUND);
      } else {
        return post;
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  // FILTER POSTS BY USER ID
  async findByUserId(id: number): Promise<Post[] | HttpException> {
    try {
      const user = await this.usersService.findOne(id);
      if (!user) {
        return new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const posts = await this.postsRepository.find({
        where: { userId: id },
        relations: ['user'],
      });
      if (posts.length === 0) {
        return new HttpException('No posts found for this user', HttpStatus.NOT_FOUND);
      } else {
        return posts;
      }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  // CREATE NEW POST
  async create(postData: CreatePostDto): Promise<HttpException> {
    try {
      const user = await this.usersService.findOne(postData.userId);
      if (user instanceof HttpException) {
        return new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }
      const newPost = this.postsRepository.create(postData);
      await this.postsRepository.save(newPost);
      return new HttpException(
        `Post titled "${postData.title}" created successfully`,
        HttpStatus.CREATED,
      );
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  // UPDATE POST
  async update(id: number, updateData: Partial<Post>): Promise<HttpException> {
    try {
      const post = await this.postsRepository.findOneBy({ id });
      if (!post) {
        return new HttpException('Post not found', HttpStatus.NOT_FOUND);
      }
      Object.assign(post, updateData);
      await this.postsRepository.save(post);
      return new HttpException(
        `Post with ID ${id} updated successfully`,
        HttpStatus.OK,
      );
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  // DELETE POST
  async delete(id: number): Promise<HttpException> {
    try {
      const post = await this.postsRepository.findOneBy({ id });
      if (!post) {
        return new HttpException('Post not found', HttpStatus.NOT_FOUND);
      }
      await this.postsRepository.remove(post);
      return new HttpException(
        `Post with ID ${id} deleted successfully`,
        HttpStatus.OK,
      );
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
}
