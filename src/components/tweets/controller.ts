import store from '../../store/mongo';
import { ITweet } from '../../interfaces/tweets';
import { E_TABLES } from '../../interfaces/store';
import { Types } from 'mongoose';

const TABLE = E_TABLES.TWEETS;

export default {
  async getTweets() {
    try {
      const tweets = await store.list(TABLE);
      return tweets;
    } catch (error) {
      throw error;
    }
  },
  async addTweet(data: ITweet) {
    try {
      const tweet = await store.upsert<ITweet>(TABLE, data);
      return tweet;
    } catch (error) {
      throw error;
    }
  },
  async deleteTweet(id: string) {
    try {
      await store.remove(TABLE, id);
      return;
    } catch (error) {
      throw error;
    }
  },

  async getSingleTweet(id: string) {
    try {
      const tweet = store.get<ITweet>(TABLE, id);
      return tweet;
    } catch (error) {
      throw error;
    }
  },

  async toggleLikeTweet(userId: Types.ObjectId, tweetId: string) {
    try {
      const tweet = await store.get<ITweet>(TABLE, tweetId);
      const likes = tweet.likes as Types.ObjectId[];
      if (!likes.some((id) => id.equals(userId))) {
        tweet.likes.push(userId);
      } else {
        tweet.likes = likes.filter((id: Types.ObjectId) => !id.equals(userId));
      }
      return store.upsert<ITweet>(TABLE, tweet);
    } catch (error) {
      throw error;
    }
  },

  async setTweetAttachments(tweetId: string, attachments: string[]) {
    try {
      const tweet = await store.get<ITweet>(TABLE, tweetId);
      tweet.attachments = attachments;
      return store.upsert<ITweet>(TABLE, tweet);
    } catch (error) {
      throw error;
    }
  },
};
