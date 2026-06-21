import type { IUser } from '../schemas/IUser.ts';
import type { CreateUserRequest } from '../dtos/CreateUserRequest.ts';
import type { UpdateUserRequest } from '../dtos/UpdateUserRequest.ts';
import type { PaginatedResponse } from '../dtos/PaginatedResponse.ts';
import { toUserResponse, type UserResponse } from '../dtos/UserResponse.ts';
import UserRepository from '../repositories/UserRepository.ts';
import NotFoundError from '#shared/errors/NotFoundError.ts';

class UserService {
  async create(payload: CreateUserRequest): Promise<UserResponse> {
    const user = await UserRepository.create(payload as IUser);
    return toUserResponse(user);
  }

  async list(page: number, limit: number): Promise<PaginatedResponse<UserResponse>> {
    const { data, total } = await UserRepository.findPaginated(page, limit);
    return { data: data.map(toUserResponse), page, limit, total };
  }

  async getById(id: string): Promise<UserResponse> {
    const user = await UserRepository.findById(id);
    if (!user) throw new NotFoundError(`User ${id} not found`);
    return toUserResponse(user);
  }

  async update(id: string, payload: UpdateUserRequest): Promise<UserResponse> {
    const user = await UserRepository.updateById(id, payload);
    if (!user) throw new NotFoundError(`User ${id} not found`);
    return toUserResponse(user);
  }

  async remove(id: string): Promise<void> {
    const user = await UserRepository.deleteById(id);
    if (!user) throw new NotFoundError(`User ${id} not found`);
  }
}

export default new UserService();
