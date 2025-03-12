const mongoose = require("mongoose");
const FoodSchema = require("../food-item"); 
const foodServices = require("./food-services");
const { MongoMemoryServer } = require("mongodb-memory-server");

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

  // Create a new connection for testing
  conn = await mongoose.createConnection(uri, mongooseOpts);

  // Register the Food model on this test connection
  foodModel = conn.model("Food", FoodSchema);

  /**
   * If your food-services.js module directly imports the Food model,
   * you might need to override it for testing. One way is to rewire or inject the
   * connection/model into the module if designed for dependency injection.
   * For this example, we assume the Food model is used in a way that the tests below work.
   */
});

afterAll(async () => {
  await conn.dropDatabase();
  await conn.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Seed the database with some dummy food items
  const dummyFoods = [
    { name: "Pizza" },
    { name: "Burger" },
    { name: "Pasta" },
  ];
  await foodModel.insertMany(dummyFoods);
});

afterEach(async () => {
  await foodModel.deleteMany();
});

test("Fetching all food items", async () => {
  const foods = await foodServices.getFood();
  expect(foods).toBeDefined();
  // expecting 3 seeded items from beforeEach
  expect(foods.length).toBe(3);
});

test("Fetching food by name", async () => {
  const foodName = "Pizza";
  const foods = await foodServices.findFoodByName(foodName);
  expect(foods).toBeDefined();
  // Should find one matching food
  expect(foods.length).toBe(1);
  foods.forEach(food => expect(food.name).toBe(foodName));
});

test("Adding a food item -- successful path", async () => {
  const newFood = { name: "Sushi" };
  const addedFood = await foodServices.addFood(newFood);
  expect(addedFood).toBeDefined();
  expect(addedFood.name).toBe(newFood.name);
  expect(addedFood).toHaveProperty("_id");

  // Confirm the new food has been added to the database
  const foods = await foodServices.getFood();
  expect(foods.length).toBe(4);
});

test("Adding a food item -- failure path (missing name)", async () => {
  // Assuming your Food schema requires a name,
  // adding an empty object should trigger a validation error.
  const newFood = {};
  let error;
  try {
    await foodServices.addFood(newFood);
  } catch (err) {
    error = err;
  }
  expect(error).toBeDefined();
});
