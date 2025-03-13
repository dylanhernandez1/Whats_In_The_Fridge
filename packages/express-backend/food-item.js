import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema(
  {
    //ID IS SET IN MONGO ALREADY
    FoodName: {
      type: String,
      required: true,
      trim: true
    },
    FoodType: {
      type: String,
      required: false,
      trim: true,
      enum: [
        "Fruit",
        "Vegetable",
        "Drinks",
        "Dairy",
        "Protein",
        "Grains",
        "Oils",
        "Sweets"
      ]
    },
    Amount: {
      type: Number,
      required: false,
      trim: true,
      min: 0
    },
    ExpirationDate: {
      type: Date,
      required: false,
      trim: true
    },
    Location: {
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
