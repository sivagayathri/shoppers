import { Injectable } from '@nestjs/common';
import { CreateAdminDto, CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from './schema/user.schema';
import { Admin } from './schema/admin.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Customer.name) private userModel: Model<Customer>,
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  createAdmin(createAdminDto: CreateAdminDto) {
    const create = new this.adminModel(createAdminDto);
    return create.save;
  }

  async signIn(email: string) {
    const user = await this.userModel.findOne({
      email: email,
    });
    return user;
  }

  findOne(id: number) {
    const user = this.userModel.findOne({ id });
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
