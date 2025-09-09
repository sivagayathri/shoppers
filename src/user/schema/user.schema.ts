import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional } from 'class-validator';
import { Document } from 'mongoose';

export type UserDocument = User & Document;
@Schema()
class Address {
  @Prop({ required: false })
  street: string;

  @Prop({ required: false })
  city: string;

  @Prop({ required: false })
  state: string;

  @Prop({ required: false })
  postalCode: string;

  @IsOptional()
  @Prop({ required: false })
  country?: string;
}

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  address?: Address;
}

export const UserSchema = SchemaFactory.createForClass(User);
