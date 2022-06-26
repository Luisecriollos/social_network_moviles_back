import mongoose, { HydratedDocument, Query } from 'mongoose';
import { E_TABLES, IQueryOptions, TABLE_MAP } from '../interfaces/store';

export default {
  list(table: E_TABLES, options?: IQueryOptions) {
    const Table = TABLE_MAP[table];
    return Table.find({ ...options?.filter });
  },
  get<T>(table: E_TABLES, id: string): Query<HydratedDocument<T>, any> {
    const Table = TABLE_MAP[table];
    return Table.findById(id);
  },

  query<T>(table: E_TABLES, options: IQueryOptions): Query<HydratedDocument<T>[], any> {
    const Table = TABLE_MAP[table];
    return Table.find(options.filter);
  },

  upsert<T>(table: E_TABLES, data: any): Query<HydratedDocument<T>, any> {
    const Table = TABLE_MAP[table];
    const { id, ...body } = data;

    return Table.findOneAndUpdate(
      { _id: id || new mongoose.Types.ObjectId() },
      { $set: body },
      { returnDocument: 'after', new: !id, upsert: true }
    );
  },

  remove(table: E_TABLES, id: string) {
    const Table = TABLE_MAP[table];

    return Table.findByIdAndDelete(id);
  },
};
