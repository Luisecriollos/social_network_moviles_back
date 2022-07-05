import mongoose, { Model } from 'mongoose';
import { User } from '../models/User';
import { Tweet } from '../models/Tweet';
import { FollowUser } from '../models/FollowUser';
import { Retweet } from '../models/Retweet';

export enum E_TABLES {
  USER = 'USER',
  TWEETS = 'TWEETS',
  FOLLOWERS_USER = 'FOLLOWERS_USER',
  RETWEETS = 'RETWEETS',
}

export const TABLE_MAP: { [table: string]: Model<any> } = {
  USER: User,
  TWEETS: Tweet,
  FOLLOWERS_USER: FollowUser,
  RETWEETS: Retweet,
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
