import type { HydratedDocument } from 'mongoose';
import type { IUser } from '../schemas/IUser.ts';

export interface UserResponse {
  _id: string;
  name: string;
  age: number;
  __v: number;
}

export function toUserResponse(doc: HydratedDocument<IUser>): UserResponse {
  return {
    _id: doc._id.toString(),
    name: doc.name,
    age: doc.age,
    __v: doc.__v,
  };
}
