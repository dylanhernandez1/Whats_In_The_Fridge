import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    }
  },
  { collection: "food_list", versionkey: false }
);

const Food = mongoose.model("Food", UserSchema);

export default Food;
