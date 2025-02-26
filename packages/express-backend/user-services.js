import userModel from "./user.js";
import foodModel from "./food-item.js";

//DWIRaCXhO11dWbPY

function getUsers() {
  return userModel.find();
}

function findUserById(id) {
  return userModel.findById(id);
}

function addUser(user) {
  const userToAdd = new userModel(user);
  const promise = userToAdd.save();
  return promise;
}

function findUserByName(name) {
  return userModel.find({ name: name });
}

function findUserByJob(job) {
  return userModel.find({ job: job });
}

function findUserByNameAndJob(name, job) {
  return userModel.find({ name: name, job: job });
}

function deleteUserById(id) {
  return userModel.findByIdAndDelete(id);
}

function findFoodByName(name) {
  return foodModel.find({ name: name });
}

function addFood(name) {
  const foodToAdd = new foodModel(name);
  const promise = foodToAdd.save();
  return promise;
}



export default {
  addUser,
  getUsers,
  findUserById,
  findUserByName,
  findUserByJob,
  findUserByNameAndJob,
  deleteUserById,
  findFood,
  addFood,
};
