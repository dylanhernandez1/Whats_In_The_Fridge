import foodModel from "./food-item.js";

function findFoodByName(name) {
  return foodModel.find({ name: name });
}

function addFood(name) {
  const foodToAdd = new foodModel(name);
  const promise = foodToAdd.save();
  return promise;
}

function getFood() {
  return foodModel.find();
}

export default {
  addFood,
  findFoodByName,
  getFood
};
