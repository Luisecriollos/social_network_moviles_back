import mongoose, { Model } from 'mongoose';
import { User } from '../models/User';
import { Tweet } from '../models/Tweet';
import { FollowUser } from '../models/FollowUser';

export enum E_TABLES {
  USER = 'USER',
  TWEETS = 'TWEETS',
  FOLLOWERS_USER = 'FOLLOWERS_USER',
}

export const TABLE_MAP: { [table: string]: Model<any> } = {
  USER: User,
  TWEETS: Tweet,
  FOLLOWERS_USER: FollowUser,
};
interface IPopulateOption<T> {
  field: keyof T;
  select: string;
}

interface ITermOption {
  field: string;
  term: string;
}
export interface IQueryOptions<T> {
  sort?: string;
  filter?: mongoose.FilterQuery<T>;
  populate?: IPopulateOption<T>[];
  search?: ITermOption;
}
