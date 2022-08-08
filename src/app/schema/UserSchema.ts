import mongoose, { Schema } from 'mongoose';
import { IUser } from '../interfaces/IUser';

const schema = new Schema<IUser>({
  name: { type: String, required: true },
  age: { type: Number, required: true }
});

const User = mongoose.model<IUser>('User', schema);

export default User;
