import { Types } from 'mongoose';
import { IUser } from './auth';

export interface ITweet {
  _id?: string | Types.ObjectId;
  owner: IUser | Types.ObjectId;
  content: string;
  created_date: Date;
  likes: IUser[] | Types.ObjectId[];
  attachments: string[];
}

export interface IRetweet {
  _id?: string | Types.ObjectId;
  user: IUser | Types.ObjectId;
  tweet: ITweet | Types.ObjectId;
  created_date?: Date;
}

export type TTimeline = 'all' | 'followers';
