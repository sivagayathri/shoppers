import { IsInt, IsOptional, IsPostalCode, IsString } from 'class-validator';

export class AddressDto {
  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsPostalCode('IN')
  postalCode: string;

  @IsOptional()
  @IsString()
  country?: string;
}
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

  @IsString()
  @IsOptional()
  address: AddressDto;
}

export class CreateAdminDto {
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

  @IsString()
  companyName: string;
}

export class AdminLogin {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
