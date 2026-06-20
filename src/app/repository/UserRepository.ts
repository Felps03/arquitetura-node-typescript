import type { IUser, IUserResponse } from '../interfaces/IUser.ts';
import UserSchema from '../schema/UserSchema.ts';

class UserRepository {
  async create(payload: IUser): Promise<IUserResponse> {
    return UserSchema.create(payload);
  }
}

export default new UserRepository();
