import foodModel from "./food-item.js";

function findFoodByExpiration() {
  /* Only return items that have the expirationDate tag */
  /* In the future, may do .limit(<quantity>) to limit the amount of items returned */
  return foodModel
    .find({ expirationDate: { $exists: true } })
    .sort({ expirationDate: 1 });
}

function findFoodByName(name) {
  return foodModel.find({ FoodName: name });
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
  findFoodByExpiration,
  getFood
};
