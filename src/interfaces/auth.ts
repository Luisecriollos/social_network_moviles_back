import mongoose from 'mongoose';

export interface IUser {
  _id: mongoose.Types.ObjectId;
  email?: string;
  name?: string;
  phoneNumber?: string;
  username?: string;
  password?: string;
  profileImg?: string;
}
