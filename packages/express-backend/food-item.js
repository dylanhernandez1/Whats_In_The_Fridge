import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    }
  },
  { collection: "food_list", versionkey: false }
);

const Food = mongoose.model("Food", FoodSchema);

export default Food;
