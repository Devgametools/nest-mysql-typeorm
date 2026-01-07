import { IsString, MinLength } from 'class-validator';

export class UpdatePassDto {
  @IsString()
  @MinLength(8)
  password: string;
}
