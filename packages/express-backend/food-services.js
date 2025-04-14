import mongoose from "mongoose";
import FoodSchema from "./food-item.js";
import dotenv from "dotenv";
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
      process.env.MONGODB_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    );
  }
  return dbConnection;
}
async function findFoodByExpiration() {
  /* Only return items that have the expirationDate tag */
  /* In the future, may do .limit(<quantity>) to limit the amount of items returned */
  const foodModel = getDbConnection().model("Food", FoodSchema);
  return await foodModel
    .find({ ExpirationDate: { $exists: true } })
    .sort({ ExpirationDate: 1 });
}

async function findFoodByName(name) {
  const foodModel = getDbConnection().model("Food", FoodSchema);
  return await foodModel.find({ FoodName: name });
}

async function addFood(food) {
  const foodModel = getDbConnection().model("Food", FoodSchema);
  try {
    if (food.ExpirationDate != undefined) {
      const foodToAdd = new foodModel(food);
      const savedFood = await foodToAdd.save();
      return savedFood;
    } else {
      return false;
    }
  } catch (error) {
    //IGNORE FOR STATEMENT COVERAGE, THIS SHOULD NOT BE REACHED
    // istanbul ignore next
    // istanbul ignore next
    console.log(error);
    // istanbul ignore next
    return false;
  }
}

async function getFood(name) {
  const foodModel = getDbConnection().model("Food", FoodSchema);

  let result;
  if (name === undefined) {
    result = await foodModel.find();
  } else {
    result = await findFoodByName(name);
  }
  return result;
}

export default {
  addFood,
  findFoodByName,
  findFoodByExpiration,
  getFood,
  setConnection
};
