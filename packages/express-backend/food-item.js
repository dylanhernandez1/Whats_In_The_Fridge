import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema(
  {
    //ID IS SET IN MONGO ALREADY
    name: {
      type: String,
      required: true,
      trim: true
    },
    amount: {
      type: Number,
      required: true,
      trim: true,
      min: 0
    },
    expirationDate: {
      type: Date,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true,
      enum: ["Fridge", "Freezer", "Pantry"]
    }
  },
  { collection: "food_list", versionkey: false }
);

const Food = mongoose.model("Food", FoodSchema);

export default Food;
