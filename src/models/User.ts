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
  username: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 200,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    set: (name: string) => name.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
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
    default: '',
  },
});

export const User = model<IUser>('Users', userSchema);
