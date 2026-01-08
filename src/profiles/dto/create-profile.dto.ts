import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  readonly firstName: string;

  @IsString()
  @MinLength(2)
  @IsNotEmpty()

  @IsString()
  readonly bio?: string;

  @IsString()
  readonly avatarUrl?: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}