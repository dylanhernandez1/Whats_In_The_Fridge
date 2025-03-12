import mongoose from "mongoose";
import FoodSchema from "../food-item.js";
import foodServices from "../food-services.js";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;
let conn;
let foodModel;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  conn = await mongoose.createConnection(uri, mongooseOpts);

  // Register the Food model on this test connection.
  foodModel = conn.model("Food", FoodSchema);

  // If we later implement dependency injection in foodServices (like setConnection),
  // we could initialize it here.
});

afterAll(async () => {
  await conn.dropDatabase();
  await conn.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Seed the database with dummy food items that use multiple fields.
  let dummyFood = { name: "Apple", type: "Fruits", amount: 10, location: "Fridge" };
  let result = new foodModel(dummyFood);
  await result.save();

  dummyFood = { name: "Carrot", type: "Vegetables", amount: 5, location: "Pantry" };
  result = new foodModel(dummyFood);
  await result.save();

  dummyFood = { name: "Milk", type: "Dairy", amount: 2, location: "Fridge" };
  result = new foodModel(dummyFood);
  await result.save();
});

afterEach(async () => {
  await foodModel.deleteMany();
});

test("Fetching all food items", async () => {
  const foods = await foodServices.getFood();
  expect(foods).toBeDefined();
  expect(foods.length).toBeGreaterThan(0);
});

test("Fetching food by name", async () => {
  const foodName = "Apple";
  const foods = await foodServices.findFoodByName(foodName);
  expect(foods).toBeDefined();
  expect(foods.length).toBeGreaterThan(0);
  foods.forEach(food => expect(food.name).toBe(foodName));
});

test("Adding food item -- successful path", async () => {
  const newFood = { name: "Banana", type: "Fruits", amount: 12, location: "Pantry" };
  const addedFood = await foodServices.addFood(newFood);
  expect(addedFood).toBeTruthy();
  expect(addedFood.name).toBe(newFood.name);
  expect(addedFood).toHaveProperty("_id");

  // Confirm the new food has been added
  const foods = await foodServices.getFood();
  expect(foods.length).toBe(4);
});

test("Adding food item -- failure path (missing name)", async () => {
  // The Food schema requires a name.
  const newFood = { type: "Sweets", amount: 5, location: "Pantry" };
  let error;
  try {
    await foodServices.addFood(newFood);
  } catch (err) {
    error = err;
  }
  expect(error).toBeDefined();
});

test("Adding food item -- failure path (invalid type)", async () => {
  // 'FastFood' is not an allowed type per the enum.
  const newFood = { name: "Chips", type: "FastFood", amount: 3, location: "Pantry" };
  let error;
  try {
    await foodServices.addFood(newFood);
  } catch (err) {
    error = err;
  }
  expect(error).toBeDefined();
});
