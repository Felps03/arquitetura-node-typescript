import type { HydratedDocument } from 'mongoose';
import type { IUser } from '../schemas/IUser.ts';
import UserSchema from '../schemas/UserSchema.ts';

class UserRepository {
  async create(payload: IUser): Promise<HydratedDocument<IUser>> {
    return UserSchema.create(payload);
  }

  async findPaginated(
    page: number,
    limit: number,
  ): Promise<{ data: HydratedDocument<IUser>[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      UserSchema.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      UserSchema.countDocuments(),
    ]);
    return { data, total };
  }

  async findById(id: string): Promise<HydratedDocument<IUser> | null> {
    return UserSchema.findById(id);
  }

  async updateById(id: string, payload: Partial<IUser>): Promise<HydratedDocument<IUser> | null> {
    return UserSchema.findByIdAndUpdate(id, payload, {
      returnDocument: 'after',
      runValidators: true,
    });
  }

  async deleteById(id: string): Promise<HydratedDocument<IUser> | null> {
    return UserSchema.findByIdAndDelete(id);
  }
}

export default new UserRepository();
