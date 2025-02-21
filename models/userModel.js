import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female', 'other'],
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpire: {
      type: Date,
      default: null,
    },
    referralCode: {
      type: String,
      unique: true,
      index: true,
      required:true
    },
    referredBy: {
      type: String,
      ref: 'User',
      default: null,
      required:false,
      immutable:true,
    },
    referrals: {
      type: [String],
      ref: 'User',
      default:[],
      required:false
    },

  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

export default User;
