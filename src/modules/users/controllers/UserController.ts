import type { Request, Response } from 'express';
import UserService from '../services/UserService.ts';
import type { CreateUserRequest } from '../dtos/CreateUserRequest.ts';
import type { UpdateUserRequest } from '../dtos/UpdateUserRequest.ts';
import type { UserResponse } from '../dtos/UserResponse.ts';
import type { PaginatedResponse } from '../dtos/PaginatedResponse.ts';

class UserController {
  async create(
    req: Request<unknown, UserResponse, CreateUserRequest>,
    res: Response<UserResponse>,
  ) {
    const result = await UserService.create(req.body);
    return res.status(201).json(result);
  }

  async list(
    req: Request<
      unknown,
      PaginatedResponse<UserResponse>,
      unknown,
      { page?: string; limit?: string }
    >,
    res: Response<PaginatedResponse<UserResponse>>,
  ) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const result = await UserService.list(page, limit);
    return res.status(200).json(result);
  }

  async getById(req: Request<{ id: string }, UserResponse>, res: Response<UserResponse>) {
    const result = await UserService.getById(req.params.id);
    return res.status(200).json(result);
  }

  async update(
    req: Request<{ id: string }, UserResponse, UpdateUserRequest>,
    res: Response<UserResponse>,
  ) {
    const result = await UserService.update(req.params.id, req.body);
    return res.status(200).json(result);
  }

  async remove(req: Request<{ id: string }>, res: Response) {
    await UserService.remove(req.params.id);
    return res.status(204).send();
  }
}

export default new UserController();
