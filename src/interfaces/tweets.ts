import mongoose from 'mongoose';
import { IUser } from './auth';

export interface ITweet {
  _id: string;
  owner: IUser | mongoose.Types.ObjectId;
  content: string;
  created_date: Date;
  likes: IUser[] | mongoose.Types.ObjectId[];
  attachments: string[];
}
