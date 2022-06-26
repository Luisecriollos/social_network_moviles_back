import { Model } from 'mongoose';
import { User } from '../models/User';
import { Tweet } from '../models/Tweet';

export enum E_TABLES {
  USER = 'USER',
  TWEETS = 'TWEETS',
}

export const TABLE_MAP: { [table: string]: Model<any> } = {
  USER: User,
  TWEETS: Tweet,
};

export interface IQueryOptions {
  sort?: string;
  filter?: any;
}
