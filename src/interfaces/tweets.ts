import { Types } from 'mongoose';
import { IUser } from './auth';

export interface ITweet {
  _id: string | Types.ObjectId;
  owner: IUser | Types.ObjectId;
  content: string;
  created_date: Date;
  likes: IUser[] | Types.ObjectId[];
  attachments: string[];
}

export type TTimeline = 'all' | 'followers';
