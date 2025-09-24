import { Injectable } from '@nestjs/common';
import {
  AdminLogin,
  CreateAdminDto,
  CreateUserDto,
} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from './schema/user.schema';
import { Admin } from './schema/admin.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Customer.name) private userModel: Model<Customer>,
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  async createAdmin(createAdminDto: CreateAdminDto) {
    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);
    const create = new this.adminModel({
      ...createAdminDto,
      password: hashedPassword,
    });
    return create.save();
  }

  async signIn(email: string) {
    const user = await this.userModel.findOne({
      email: email,
    });
    return user;
  }

  async findOne(id: number) {
    const user = this.userModel.findOne({ id });
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async adminSignIn(adminLoginInput: AdminLogin) {
    const admin = await this.adminModel.findOne({
      email: adminLoginInput.email,
    });

    if (!admin) {
      throw new Error('Admin not found');
    }

    const password = await bcrypt.compare(
      adminLoginInput.password,
      admin.password,
    );

    if (!password) {
      throw new Error('Invalid credentials');
    }

    return admin;
  }
}
