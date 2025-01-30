import mongoose from 'mongoose';

const socialSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      required: true,
      enum: ['google', 'apple'],
    },
    providerId: {
      type: String,
      required: true,
    }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
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
      required: false,
      unique: true,
    },
    state: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      required: false,
      enum: ['male', 'female', 'other'],
    },
    password: {
      type: String,
      required: false,
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
    social:[socialSchema]
  },
  {
    timestamps: true,
  }
);


const User = mongoose.model('User', userSchema);

export default User;