import mongoose from "mongoose";

const UserHouseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    house: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "House",
      required: true,
    },
    role: {
      type: String,
      enum: ["owner", "member"], // Role can be 'owner' or 'member'
      default: "member",
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "user_houses",
    timestamps: true,
    versionKey: false,
  }
);

export default UserHouseSchema;