import { Injectable } from '@nestjs/common';
import {
  AdminLogin,
  CreateAdminDto,
  CreateUserDto,
  SignInDto,
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
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
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

  async signIn(signInDto: SignInDto) {
    const user = await this.userModel.findOne({
      email: signInDto.email,
    });

    if (!user) {
      return { error: 'User not found' };
    }

    const isPasswordValid = await bcrypt.compare(
      signInDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      return { error: 'Invalid credentials' };
    }

    return user;
  }

  async findOne(id: number) {
    const user = this.userModel.findOne({ id });
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findOneAndUpdate(
      { id },
      updateUserDto,
      { new: true },
    );
    return user;
  }

  async remove(id: number) {
    const user = await this.userModel.findOneAndDelete({ id });
    return user ? { message: 'User deleted' } : { error: 'User not found' };
  }

  async adminSignIn(adminLoginInput: AdminLogin) {
    const admin = await this.adminModel.findOne({
      email: adminLoginInput.email,
    });

    if (!admin) {
      return { error: 'Admin not found' };
    }

    const isPasswordValid = await bcrypt.compare(
      adminLoginInput.password,
      admin.password,
    );

    if (!isPasswordValid) {
      return { error: 'Invalid credentials' };
    }

    return admin;
  }
}
