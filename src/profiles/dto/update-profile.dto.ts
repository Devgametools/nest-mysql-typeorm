import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  readonly firstName?: string;

  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  readonly lastName?: string;

  @IsString()
  readonly bio?: string;

  @IsString()
  readonly avatarUrl?: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email?: string;
}