import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      index: true,
      validate: {
        validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: "Invalid email format."
      }
    },
    password: { type: String, required: true },
    profileImage: { type: String, default: "" },
    preferences: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: () => ({
        darkMode: false,
        language: "en",
        notifications: { email: false, sms: false }
      })
    },
    emailVerified: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user"
    },
    lastLogin: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
  },
  {
    collection: "users_list",
    timestamps: true,
    versionKey: false
  }
);

export default UserSchema;
