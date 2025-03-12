import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema(
  {
    //ID IS SET IN MONGO ALREADY
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      required: false,
      trim: true,
      enum: [
        "Fruits",
        "Vegetables",
        "Drinks",
        "Dairy",
        "Protein",
        "Grains",
        "Oils",
        "Sweets"
      ]
    },
    amount: {
      type: Number,
      required: false,
      trim: true,
      min: 0
    },
    expirationDate: {
      type: Date,
      required: false,
      trim: true
    },
    location: {
      type: String,
      required: false,
      trim: true,
      enum: ["Fridge", "Freezer", "Pantry"]
    }
  },
  { collection: "food_list", versionkey: false }
);

const Food = mongoose.model("Food", FoodSchema);

export default Food;
