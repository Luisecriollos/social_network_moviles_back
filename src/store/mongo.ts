import mongoose, { HydratedDocument, Query, Types } from 'mongoose';
import { E_TABLES, IQueryOptions, TABLE_MAP } from '../interfaces/store';

export default {
  list<T>(table: E_TABLES, options?: IQueryOptions<T>): Query<HydratedDocument<T>[], any> {
    const Table = TABLE_MAP[table];
    let config = {
      ...options?.filter,
    };
    if (options?.search) {
      config = {
        ...config,
        [options.search.field]: { $regex: options.search.term, $options: 'i' },
      };
    }
    let result = Table.find({ ...config });
    if (options?.populate) {
      options.populate.forEach((opt) => {
        result = result.populate(opt.field.toString(), opt.select);
      });
    }
    return result;
  },
  get<T>(table: E_TABLES, id: string): Query<HydratedDocument<T>, any> {
    const Table = TABLE_MAP[table];
    return Table.findById(id);
  },

  upsert<T extends { _id?: string | Types.ObjectId }>(table: E_TABLES, data: T): Query<HydratedDocument<T>, any> {
    const Table = TABLE_MAP[table];
    const { _id, ...body } = data;

    return Table.findOneAndUpdate(
      { _id: _id || new mongoose.Types.ObjectId() },
      { $set: body },
      { returnDocument: 'after', new: !_id, upsert: true }
    );
  },

  remove(table: E_TABLES, id: string) {
    const Table = TABLE_MAP[table];

    return Table.findByIdAndDelete(id);
  },
};
