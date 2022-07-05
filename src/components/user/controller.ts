import store from '../../store/mongo';
import { ITweet } from '../../interfaces/tweets';
import { E_TABLES } from '../../interfaces/store';
import { Types } from 'mongoose';
import { IFollowUser } from '../../interfaces/followers';

const TABLE = E_TABLES.FOLLOWERS_USER;

export default {
  async getFollowers(userId: string) {
    try {
      const followers = (
        await store.list<IFollowUser>(TABLE, {
          filter: { followed: userId },
          populate: [
            {
              field: 'follower',
              select: '_id name username profileImg',
            },
          ],
        })
      ).map((relationship) => relationship.follower);

      return followers;
    } catch (error) {
      throw error;
    }
  },

  async getFollowing(userId: string) {
    try {
      const following = (
        await store.list<IFollowUser>(TABLE, {
          filter: { follower: userId },
          populate: [
            {
              field: 'followed',
              select: '_id name username profileImg',
            },
          ],
        })
      ).map((relationship) => relationship.followed);

      return following;
    } catch (error) {
      throw error;
    }
  },

  async toggleFollowUser(followerId: string, followedId: string) {
    try {
      const isFollowing = (await store.list<IFollowUser>(TABLE, { filter: { follower: followerId, followed: followedId } }))[0];

      if (!isFollowing) {
        const following = await store.upsert<IFollowUser>(TABLE, {
          followed: new Types.ObjectId(followedId),
          follower: new Types.ObjectId(followerId),
        });
        return following;
      } else {
        await store.remove(TABLE, isFollowing._id.toString());
        return;
      }
    } catch (error) {
      throw error;
    }
  },
};
