import { model, Schema } from 'mongoose';
import { IUser } from '../interfaces/auth';

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: 100,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 500,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    maxlength: 100,
  },
  phoneNumber: {
    type: String,
    required: false,
    trim: true,
    lowercase: true,
    maxlength: 100,
  },
  profileImg: {
    type: String,
    default: process.env.HOST + '/images/profileDefault.jpg',
  },
});

export const User = model<IUser>('Users', userSchema);
