import { IUser, IUserResponse } from '../interfaces/IUser';
import UserSchema from '../schema/UserSchema';

class UserRepository {
  async create(payload: IUser): Promise<IUserResponse> {
    return UserSchema.create(payload);
  }
}

export default new UserRepository();
