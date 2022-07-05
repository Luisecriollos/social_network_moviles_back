import { model, Schema } from 'mongoose';
import { IFollowUser } from '../interfaces/followers';

const followUserSchema = new Schema<IFollowUser>({
  follower: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
  },
  followed: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
  },
  created_date: {
    type: Date,
    default: new Date(),
  },
});

export const FollowUser = model<IFollowUser>('FollowUser', followUserSchema);
