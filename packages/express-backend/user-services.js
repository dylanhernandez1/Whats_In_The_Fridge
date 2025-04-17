import mongoose from "mongoose";
import UserSchema from "./user.js";
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

/**
 * Add a new user.
 * Requires at least email, password, and name fields.
 */
async function addUser(user) {
  const userModel = getDbConnection().model("User", UserSchema);
  if (!user.email || !user.name || !user.password) return false;

  try {
    const userToAdd = new userModel(user);
    const savedUser = await userToAdd.save();
    return savedUser;
  } catch (error) {
    console.log("Add user error:", error);
    return false;
  }
}

/**
 * Get all users or filter by _id or email.
 */
async function getUsers(filter = {}) {
  // Example input: filter = { email: "example@gmail.com"}
  const userModel = getDbConnection().model("User", UserSchema);

  if (filter.id) {
    return await findUserById(filter.id);
  } else if (filter.email) {
    return await findUserByEmail(filter.email);
  } else {
    return await userModel.find();
  }
}

/**
 * Find user by MongoDB _id.
 */
async function findUserById(id) {
  const userModel = getDbConnection().model("User", UserSchema);
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  try {
    return await userModel.findById(id);
  } catch (error) {
    console.log("Find by ID error:", error);
    return undefined;
  }
}

/**
 * Find user by email.
 */
async function findUserByEmail(email) {
  const userModel = getDbConnection().model("User", UserSchema);
  return await userModel.findOne({ email });
}

/**
 * Find user(s) by name (exact match).
 */
async function findUserByName(name) {
  const userModel = getDbConnection().model("User", UserSchema);
  return await userModel.find({ name });
}

/**
 * Delete a user by their MongoDB _id.
 */
async function deleteUserById(id) {
  const userModel = getDbConnection().model("User", UserSchema);
  if (!mongoose.Types.ObjectId.isValid(id)) return false;

  try {
    const deletedUser = await userModel.findByIdAndDelete(id);
    return deletedUser;
  } catch (error) {
    console.log("Delete user error:", error);
    return false;
  }
}

/**
 * Delte a user by their email.
 */
async function deleteUserByEmail(email) {
  const userModel = getDbConnection().model("User", UserSchema);
  try {
    const deletedUser = await userModel.findOneAndDelete({
      email
    });
    return deletedUser;
  } catch (error) {
    console.log("Delete user by email error:", error);
    return false;
  }
}

export default {
  addUser,
  getUsers,
  findUserById,
  findUserByEmail,
  findUserByName,
  deleteUserById,
  deleteUserByEmail,
  setConnection
};
