import type { IUserResponse, IUser } from '../interfaces/IUser.ts';
import UserRepository from '../repository/UserRepository.ts';

class UserService {
  async create(payload: IUser): Promise<IUserResponse> {
    const result = await UserRepository.create(payload);
    return result;
  }
}

export default new UserService();
