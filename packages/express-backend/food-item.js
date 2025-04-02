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
        "Dairy",
        "Protein",
        "Grains",
        "Fats & Oils",
        "Sugars & Sweets",
        "Drinks"
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
  { collection: "food_list", versionKey: false }
);

export default FoodSchema;
