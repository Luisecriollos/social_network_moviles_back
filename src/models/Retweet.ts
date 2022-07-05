import { model, Schema } from 'mongoose';
import { IRetweet } from '../interfaces/tweets';

const retweetSchema = new Schema<IRetweet>({
  tweet: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Tweets',
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Users',
  },
  created_date: {
    type: Date,
    default: new Date(),
  },
});

export const Retweet = model<IRetweet>('Retweets', retweetSchema);
