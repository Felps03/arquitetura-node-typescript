import { Types } from 'mongoose';

export interface IUser {
  name: string;
  age: number;
}

export interface IUserResponse {
  name: string;
  age: number;
  _id: Types.ObjectId;
  __v?: number;
}
