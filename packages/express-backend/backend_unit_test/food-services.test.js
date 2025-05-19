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

  conn = await mongoose.createConnection(uri);

  // Register the Food model on this test connection.
  foodModel = conn.model("Food", FoodSchema);

  // Set the connection for foodServices so that getDbConnection returns our test connection.
  foodServices.setConnection(conn);
});

afterAll(async () => {
  // Clean up both connections.
  await conn.dropDatabase();
  await conn.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Seed the database with dummy food items (without expiration dates).
  const dummyFoods = [
    {
      FoodName: "Apple",
      FoodType: "Fruit",
      Amount: 10,
      Location: "fridge",
      ExpirationDate: null
    },
    {
      FoodName: "Carrot",
      FoodType: "Vegetable",
      Amount: 5,
      Location: "pantry",
      ExpirationDate: null
    },
    {
      FoodName: "Milk",
      FoodType: "Dairy",
      Amount: 2,
      Location: "fridge",
      ExpirationDate: null
    }
  ];

  await foodModel.insertMany(dummyFoods);
});

afterEach(async () => {
  await foodModel.deleteMany();
});

test("setConnection returns the connection", () => {
  const dummyConn = { hello: "world" };
  expect(foodServices.setConnection(dummyConn)).toBe(dummyConn);
  // Reset back to our test connection
  foodServices.setConnection(conn);
});

test("getFood without a name returns all food items", async () => {
  const foods = await foodServices.getFood();
  expect(foods).toBeDefined();
  expect(foods.length).toBe(3);
});

test("getFood with a name parameter returns matching items", async () => {
  const foods = await foodServices.getFood("Apple");
  expect(foods).toBeDefined();
  expect(foods.length).toBeGreaterThan(0);
  foods.forEach((food) => expect(food.FoodName).toBe("Apple"));
});

test("findFoodByName returns matching food items", async () => {
  const foods = await foodServices.findFoodByName("Carrot");
  expect(foods).toBeDefined();
  expect(foods.length).toBeGreaterThan(0);
  foods.forEach((food) => expect(food.FoodName).toBe("Carrot"));
});

test("findFoodByExpiration returns only food items with an ExpirationDate (sorted ascending)", async () => {
  // Insert additional food items with an expiration date.
  const expiringFoods = [
    {
      FoodName: "Cheese",
      FoodType: "Dairy",
      Amount: 1,
      Location: "fridge",
      ExpirationDate: new Date("2025-04-01")
    },
    {
      FoodName: "Yogurt",
      FoodType: "Dairy",
      Amount: 3,
      Location: "fridge",
      ExpirationDate: new Date("2025-03-20")
    }
  ];
  await foodModel.insertMany(expiringFoods);

  const foods = await foodServices.findFoodByExpiration();
  // Only items with an ExpirationDate should be returned.
  expect(foods).toBeDefined();
  expect(foods.length).toBeGreaterThanOrEqual(2);
  // Verify they are sorted in ascending order.
  const dates = foods.map(
    (food) => new Date(food.ExpirationDate)
  );
  expect(dates[0] <= dates[1]).toBe(true);
});

test("addFood successfully adds a food item", async () => {
  const newFood = {
    FoodName: "Banana",
    FoodType: "Fruit",
    Amount: 12,
    Location: "pantry",
    ExpirationDate: new Date("2025-05-01")
  };
  const addedFood = await foodServices.addFood(newFood);
  expect(addedFood).toBeTruthy();
  expect(addedFood.FoodName).toBe(newFood.FoodName);
  expect(addedFood).toHaveProperty("_id");

  // Confirm the new food item has been added (3 seeded + 1 new = 4).
  const foods = await foodServices.getFood();
  expect(foods.length).toBe(4);
});

test("Testing Delete Successful", async () => {
  const newFood = {
    FoodName: "Banana",
    FoodType: "Fruit",
    Amount: 12,
    Location: "pantry",
    ExpirationDate: new Date("2025-05-01")
  };
  const addedFood = await foodServices.addFood(newFood);

  const deletedFood = await foodServices.deleteFoodById(
    addedFood._id
  );

  expect(deletedFood).toBeTruthy();
  expect(deletedFood.FoodName).toBe(addedFood.FoodName);
  const foods = await foodServices.getFood();
  expect(foods.length).toBe(3);
});

test("Testing Delete Not Successful", async () => {
  const deletedFood = await foodServices.deleteFoodById(123);
  expect(deletedFood).toBeFalsy();
});
