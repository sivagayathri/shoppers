import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateUserDto, userSchema } from './dto/create-user.dto';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CreateUserDto.name, schema: userSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
