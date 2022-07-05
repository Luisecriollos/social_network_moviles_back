import { Types } from 'mongoose';

export interface IFollowUser {
  _id?: Types.ObjectId;
  follower: Types.ObjectId;
  followed: Types.ObjectId;
  created_date?: Date;
}
