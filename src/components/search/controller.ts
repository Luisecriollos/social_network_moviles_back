import { E_TABLES } from '../../interfaces/store';
import store from '../../store/mongo';

export default {
  async searchTerm(term: string) {
    try {
      const users = await store.list(E_TABLES.USER, { search: { field: 'name', term } });
      const tweets = await store.list(E_TABLES.TWEETS, { search: { field: 'content', term } });
      return { users, tweets };
    } catch (error) {
      throw error;
    }
  },
};
