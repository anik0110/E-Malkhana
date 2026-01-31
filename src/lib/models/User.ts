import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  badgeId: { type: String, required: true, unique: true }, // <--- ADD THIS LINE
  role: { type: String, default: 'officer' },
}, { timestamps: true });

export const User = models.User || model('User', UserSchema);