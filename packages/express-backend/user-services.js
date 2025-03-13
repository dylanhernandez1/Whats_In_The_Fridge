import mongoose from "mongoose";
import UserSchema from "./user";
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

async function getUsers(name, job) {
  const userModel = getDbConnection().model("User", UserSchema);
  let result;

  if (name === undefined && job === undefined) {
    result = await userModel.find();
  } else if (name && job === undefined) {
    result = await findUserByName(name);
  } else if (job && name === undefined) {
    result = await findUserByJob(job);
  } else {
    result = await findUserByNameAndJob(name, job);
  }
  return result;
}

async function findUserById(id) {
  const userModel = getDbConnection().model("User", UserSchema);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  try {
    return await userModel.findById(id);
  } catch (error) {
    //IGNORE FOR STATEMENT COVERAGE, THIS SHOULD NOT BE REACHED
    // istanbul ignore next
    // istanbul ignore next
    console.log(error);
    // istanbul ignore next
    return undefined;
  }
}

async function addUser(user) {
  const userModel = getDbConnection().model("User", UserSchema);
  if (!user.email) {
    throw new Error("Email is required.");
  }
  try {
    const userToAdd = new userModel(user);
    const savedUser = await userToAdd.save();
    return savedUser;
  } catch (error) {
    //IGNORE FOR STATEMENT COVERAGE, THIS SHOULD NOT BE REACHED
    // istanbul ignore next
    // istanbul ignore next
    console.log(error);
    // istanbul ignore next
    return false;
  }
}

async function findUserByName(name) {
  const userModel = getDbConnection().model("User", UserSchema);
  return await userModel.find({ name: name });
}

async function findUserByJob(job) {
  const userModel = getDbConnection().model("User", UserSchema);
  return await userModel.find({ job: job });
}

async function findUserByNameAndJob(name, job) {
  const userModel = getDbConnection().model("User", UserSchema);
  return await userModel.find({ name: name, job: job });
}

async function deleteUserById(id) {
  const userModel = getDbConnection().model("User", UserSchema);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return false;
  }
  try {
    const deletedUser = await userModel.findByIdAndDelete(id);
    return deletedUser;
  } catch (error) {
    //IGNORE FOR STATEMENT COVERAGE, THIS SHOULD NOT BE REACHED
    // istanbul ignore next
    // istanbul ignore next
    console.log(error);
    // istanbul ignore next
    return false;
  }
}

export default {
  addUser,
  getUsers,
  findUserById,
  findUserByName,
  findUserByJob,
  findUserByNameAndJob,
  deleteUserById,
  setConnection
};
