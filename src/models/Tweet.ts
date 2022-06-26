import { model, Schema } from 'mongoose';
import { ITweet } from '../interfaces/tweets';

const tweetSchema = new Schema<ITweet>({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
  },
  content: {
    type: String,
    required: true,
  },
  created_date: {
    type: Date,
    default: new Date(),
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      default: [],
    },
  ],
  attachments: [
    {
      type: String,
    },
  ],
});

export const Tweet = model<ITweet>('Tweets', tweetSchema);
