import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
      trim: true
    },
    Email: {
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
    Password: { type: String, required: true },
    ProfileImage: { type: String, default: "" },
    Preferences: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: () => ({
        darkMode: false,
        language: "en",
        notifications: { email: false, sms: false }
      })
    },
    EmailVerified: { type: Boolean, default: false },
    Role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user"
    },
    LastLogin: { type: Date },
    ResetPasswordToken: { type: String },
    ResetPasswordExpires: { type: Date }
  },
  {
    collection: "users_list",
    timestamps: true,
    versionKey: false
  }
);

export default UserSchema;
