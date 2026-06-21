import mongoose, { Schema } from 'mongoose';
import type { IUser } from './IUser.ts';

const schema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
      max: 120,
    },
  },
  { timestamps: true },
);

const User = mongoose.model<IUser>('User', schema);

export default User;
