import mongoose from "mongoose";
import UserHouseSchema from "./user-house.js"; // Import your UserHouse schema
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
    dbConnection = mongoose.createConnection(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  return dbConnection;
}

// Add a user to a house
async function addUserToHouse(userId, houseId, role = "member") {
  const userHouseModel = getDbConnection().model("UserHouse", UserHouseSchema);
  try {
    const existingUserHouse = await userHouseModel.findOne({ user: userId, house: houseId });
    if (existingUserHouse) {
      return { success: false, message: "User is already part of the house." };
    }

    const newUserHouse = new userHouseModel({
      user: userId,
      house: houseId,
      role: role,
    });

    const savedUserHouse = await newUserHouse.save();
    return { success: true, savedUserHouse };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error adding user to house" };
  }
}

// Remove a user from a house
async function removeUserFromHouse(userId, houseId) {
  const userHouseModel = getDbConnection().model("UserHouse", UserHouseSchema);
  try {
    const removedUserHouse = await userHouseModel.findOneAndDelete({ user: userId, house: houseId });
    if (!removedUserHouse) {
      return { success: false, message: "User is not part of the house." };
    }
    return { success: true, removedUserHouse };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error removing user from house" };
  }
}

// Change a user's role in a house
async function changeUserRoleInHouse(userId, houseId, newRole) {
  const userHouseModel = getDbConnection().model("UserHouse", UserHouseSchema);
  try {
    const validRoles = ["owner", "member"];
    if (!validRoles.includes(newRole)) {
      return { success: false, message: "Invalid role." };
    }

    const updatedUserHouse = await userHouseModel.findOneAndUpdate(
      { user: userId, house: houseId },
      { role: newRole },
      { new: true }
    );

    if (!updatedUserHouse) {
      return { success: false, message: "User is not part of the house." };
    }

    return { success: true, updatedUserHouse };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error changing user role in house" };
  }
}

// Get all users in a specific house
async function getUsersInHouse(houseId) {
  const userHouseModel = getDbConnection().model("UserHouse", UserHouseSchema);
  try {
    const usersInHouse = await userHouseModel.find({ house: houseId }).populate("user");
    return { success: true, usersInHouse };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error retrieving users in house" };
  }
}

// Get all houses a user belongs to
async function getHousesByUser(userId) {
  const userHouseModel = getDbConnection().model("UserHouse", UserHouseSchema);
  try {
    const housesByUser = await userHouseModel.find({ user: userId }).populate("house");
    return { success: true, housesByUser };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error retrieving houses for user" };
  }
}

export default {
  setConnection,
  addUserToHouse,
  removeUserFromHouse,
  changeUserRoleInHouse,
  getUsersInHouse,
  getHousesByUser,
};