import mongoose from "mongoose";
import HouseSchema from "./house.js";
import dotenv from "dotenv";
import FoodSchema from "./food-item.js";
dotenv.config();

let dbConnection;

function setConnection(newConn) {
  dbConnection = newConn;
  return dbConnection;
}

function getDbConnection() {
  // istanbul ignore next
  if (!dbConnection) {
    // istanbul ignore next
    dbConnection = mongoose.createConnection(
      process.env.MONGODB_URI
    );
  }
  return dbConnection;
}

async function createHouse(houseData) {
  const houseModel = getDbConnection().model(
    "House",
    HouseSchema
  );
  try {
    const newHouse = new houseModel(houseData);
    const savedHouse = await newHouse.save();
    return savedHouse;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getHouses() {
  const houseModel = getDbConnection().model(
    "House",
    HouseSchema
  );
  try {
    const houses = await houseModel.find({});
    return houses;
  } catch (error) {
    // istanbul ignore next
    console.error("Error retrieving houses:", error);
    // istanbul ignore next
    throw error;
  }
}

async function addFoodToHouse(houseId, location, food) {
  const houseModel = getDbConnection().model(
    "House",
    HouseSchema
  );
  const foodModel = getDbConnection().model("Food", FoodSchema);

  try {
    const house = await houseModel.findById(houseId);
    if (!house) {
      return { success: false, message: "House not found" };
    }

    console.log(food);
    // Check that food item has required properties
    if (
      food.FoodName &&
      food.FoodType &&
      food.Amount > 0 &&
      food.ExpirationDate &&
      CheckFoodLocationValid(food.Location)
    ) {
      const foodToAdd = new foodModel(food);
      const savedFood = await foodToAdd.save();

      // Add the food to the appropriate location in the house
      house[location].push(savedFood);
      await house.save();

      console.log("Returning ", savedFood);
      return { success: true, savedFood };
    } else {
      return { success: false, message: "Invalid food item" };
    }
  } catch (error) {
    console.log(error);
    return { success: false, message: "Error adding food" };
  }
}

async function getHouseById(houseId) {
  const houseModel = getDbConnection().model(
    "House",
    HouseSchema
  );
  try {
    const house = await houseModel.findById(houseId);
    return house;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function getFoodFromHouse(houseId, location) {
  const houseModel = getDbConnection().model(
    "House",
    HouseSchema
  );
  try {
    const house = await houseModel.findById(houseId);
    if (!house) {
      return { success: false, message: "House not found" };
    }

    if (!CheckFoodLocationValid(location)) {
      return { success: false, message: "Invalid location" };
    }

    return { success: true, foodItems: house[location] };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Error fetching food" };
  }
}

async function getAllFoodFromHouse(houseId) {
  const houseModel = getDbConnection().model(
    "House",
    HouseSchema
  );
  try {
    const house = await houseModel.findById(houseId);
    if (!house) {
      return { success: false, message: "House not found" };
    }
    // Use .concat to merge arrays
    const allFood = house.fridge.concat(
      house.freezer,
      house.pantry
    );

    return { success: true, foodItems: allFood };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Error fetching food" };
  }
}

function CheckFoodLocationValid(str) {
  const list = ["fridge", "freezer", "pantry", "groceryList"];
  return list.some((item) => str === item);
}

async function removeFoodFromHouse(houseId, foodId) {
  const houseModel = getDbConnection().model(
    "House",
    HouseSchema
  );
  try {
    const house = await houseModel.findById(houseId);
    if (!house) {
      return { success: false, message: "House not found" };
    }

    let updated = false;

    // Go through each location and remove the food if present
    ["fridge", "freezer", "pantry", "groceryList"].forEach(
      (location) => {
        const originalLength = house[location].length;
        house[location] = house[location].filter(
          (item) => item._id.toString() !== foodId.toString()
        );
        if (house[location].length !== originalLength)
          updated = true;
      }
    );

    if (updated) {
      await house.save();
      return {
        success: true,
        message: "Food removed from house"
      };
    } else {
      return {
        success: false,
        message: "Food not found in house"
      };
    }
  } catch (error) {
    console.log("Error removing food from house:", error);
    return { success: false, message: "Error updating house" };
  }
}

async function deleteHouseById(houseId) {
  const houseModel = getDbConnection().model(
    "House",
    HouseSchema
  );

  try {
    const result = await houseModel.findByIdAndDelete(houseId);
    if (!result) {
      console.log(`No house found with id: ${houseId}`);
      return null;
    }
    console.log(
      `House with id ${houseId} deleted successfully.`
    );
    return result;
  } catch (error) {
    console.log(
      `Error deleting house with id ${houseId}:`,
      error
    );
    return null;
  }
}

async function findHouseById(houseId) {
  const houseModel = getDbConnection().model(
    "House",
    HouseSchema
  );

  try {
    const house = await houseModel.findById(houseId);
    if (!house) {
      return { success: false, message: "House not found" };
    }
    return { success: true, house: house };
  } catch (error) {
    console.log("Error finding house:", error);
    return { success: false, message: "Error finding house" };
  }
}

async function updateHouseById(houseId, updateData) {
  const houseModel = getDbConnection().model(
    "House",
    HouseSchema
  );

  try {
    const updatedHouse = await houseModel.findByIdAndUpdate(
      houseId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedHouse) {
      return { success: false, message: "House not found" };
    }

    return { success: true, updatedHouse };
  } catch (error) {
    console.log("Error updating house:", error);
    return { success: false, message: "Error updating house" };
  }
}

export default {
  setConnection,
  getHouses,
  createHouse,
  addFoodToHouse,
  getHouseById,
  getFoodFromHouse,
  getAllFoodFromHouse,
  removeFoodFromHouse,
  deleteHouseById,
  findHouseById,
  updateHouseById
};
