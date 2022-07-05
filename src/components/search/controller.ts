import { IUser } from '../../interfaces/auth';
import { E_TABLES } from '../../interfaces/store';
import { ITweet } from '../../interfaces/tweets';
import store from '../../store/mongo';

export default {
  async searchTerm(term: string) {
    const fieldsToPopulate = '_id name username profileImg';
    try {
      const users = await store.list<IUser>(E_TABLES.USER, { search: { field: 'name', term } });
      const tweets = await store.list<ITweet>(E_TABLES.TWEETS, {
        populate: [
          { field: 'likes', select: fieldsToPopulate },
          { field: 'owner', select: fieldsToPopulate },
        ],
        search: { field: 'content', term },
      });
      return { users, tweets };
    } catch (error) {
      throw error;
    }
  },
};
