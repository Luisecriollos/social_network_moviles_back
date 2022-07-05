import store from '../../store/mongo';
import { IRetweet, ITweet, TTimeline } from '../../interfaces/tweets';
import { E_TABLES } from '../../interfaces/store';
import { Types } from 'mongoose';

const TABLE = E_TABLES.TWEETS;
const RETWEET_TABLE = E_TABLES.RETWEETS;

export default {
  async getTweets(feedType: TTimeline, following: string[] = []) {
    const fieldsToPopulate = '_id name username profileImg';
    const tweets = await store
      .list<ITweet>(TABLE, {
        filter: feedType === 'all' ? undefined : { owner: { $in: following.map((id) => new Types.ObjectId(id)) } },
        populate: [
          { field: 'owner', select: fieldsToPopulate },
          { field: 'likes', select: fieldsToPopulate },
        ],
      })
      .sort({ created_date: 'desc' });
    return tweets;
  },
  async getRetweets(feedType: TTimeline, following: string[] = []) {
    const tweets = await store
      .list<IRetweet>(RETWEET_TABLE, {
        filter: feedType === 'all' ? undefined : { user: { $in: following.map((id) => new Types.ObjectId(id)) } },
        populate: [
          { field: 'user', select: '_id name username profileImg' },
          { field: 'tweet', select: '_id content created_at likes' },
        ],
      })
      .sort({ created_date: 'desc' });
    return tweets;
  },
  async addTweet(data: ITweet) {
    const tweet = await store.upsert<ITweet>(TABLE, data);
    return tweet;
  },
  async deleteTweet(id: string) {
    await store.remove(TABLE, id);
    return;
  },

  async getSingleTweet(id: string) {
    try {
      const tweet = await store.get<ITweet>(TABLE, id);
      return tweet;
    } catch (error) {
      throw error;
    }
  },

  async retweet(tweetId: string, userId: string) {
    const alreadyRetweeted = (
      await store.list<IRetweet>(RETWEET_TABLE, {
        filter: { tweet: new Types.ObjectId(tweetId), user: new Types.ObjectId(userId) },
      })
    )[0];

    if (!alreadyRetweeted) {
      const retweet = await store.upsert<IRetweet>(
        RETWEET_TABLE,
        {
          tweet: new Types.ObjectId(tweetId),
          user: new Types.ObjectId(userId),
        },
        [
          { field: 'tweet', select: '_id content likes created_at' },
          { field: 'user', select: '_id name username profileImg' },
        ]
      );
      return retweet;
    } else {
      await store.remove(RETWEET_TABLE, alreadyRetweeted._id.toString());
      return;
    }
  },

  async toggleLikeTweet(userId: Types.ObjectId, tweetId: string) {
    const tweet = await store.get<ITweet>(TABLE, tweetId);
    const likes = tweet.likes as Types.ObjectId[];
    if (!likes.some((id) => id.equals(userId))) {
      tweet.likes.push(userId);
    } else {
      tweet.likes = likes.filter((id: Types.ObjectId) => !id.equals(userId));
    }
    return store.upsert<ITweet>(TABLE, tweet);
  },

  async setTweetAttachments(tweetId: string, attachments: string[]) {
    const tweet = await store.get<ITweet>(TABLE, tweetId);
    tweet.attachments = attachments;
    return store.upsert<ITweet>(TABLE, tweet);
  },
};
