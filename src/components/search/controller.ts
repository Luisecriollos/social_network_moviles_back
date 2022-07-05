import { IUser } from '../../interfaces/auth';
import { E_TABLES } from '../../interfaces/store';
import { ITweet } from '../../interfaces/tweets';
import store from '../../store/mongo';

export default {
  async searchTerm(term: string) {
    const fieldsToPopulate = '_id name username profileImg';
    const reg = new RegExp(term, 'i');
    try {
      const users = await store
        .list<IUser>(E_TABLES.USER, {
          filter: { $or: [{ name: { $regex: reg } }, { username: { $regex: reg } }] },
        })
        .select(fieldsToPopulate);
      const tweets = await store.list<ITweet>(E_TABLES.TWEETS, {
        filter: { $or: [{ content: { $regex: reg } }, { owner: { $in: users.map((user) => user._id) } }] },
        populate: [
          { field: 'likes', select: fieldsToPopulate },
          { field: 'owner', select: fieldsToPopulate },
        ],
      });
      return { users, tweets };
    } catch (error) {
      throw error;
    }
  },
};
