import mongoose from "mongoose";
import FoodSchema from "./FoodItem";  // Import your Food schema

const HouseSchema = new mongoose.Schema(
  {
    houseName: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true
    },
    town: {
      type: String,
      required: true,
      trim: true
    },
    fridge: [FoodSchema],  // Embedding FoodItem schema directly in fridge
    freezer: [FoodSchema], // Embedding FoodItem schema directly in freezer
    pantry: [FoodSchema],  // Embedding FoodItem schema directly in pantry
    groceryList: [FoodSchema],  // Embedding FoodItem schema directly in groceryList
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    collection: "houses",
    timestamps: true,
    versionKey: false
  }
);

const House = mongoose.model("House", HouseSchema);

export default House;