import { IsInt, IsString } from 'class-validator';

export class CreateUserDto {
  @IsInt()
  id: number;

  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  password: string;
}
