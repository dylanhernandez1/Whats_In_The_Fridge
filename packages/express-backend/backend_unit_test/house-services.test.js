import mongoose from "mongoose";
import UserSchema from "../user.js";
import userServices from "../user-services.js";
import houseSchema from "../house.js";
import houseServices from "../house-services.js";
import foodSchema from "../food-item.js";
import foodServices from "../food-services.js";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;
let conn;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  conn = await mongoose.createConnection(uri);

  userModel = conn.model("User", UserSchema);
  houseModel = conn.model("House", houseSchema);
  foodModel = conn.model("Food", foodSchema);

  userServices.setConnection(conn);
  houseServices.setConnection(conn);
  foodServices.setConnection(conn);
});

afterAll(async () => {
  await conn.dropDatabase();
  await conn.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  const dummyUser1 = {
    name: "Chuck Norris",
    email: "cnor123@gmailexample.com",
    password: "password123"
  };
  const result1 = new userModel(dummyUser1);
  await result1.save();

  const dummyUser2 = {
    name: "Bruce Lee",
    email: "brucelee@example.com",
    password: "password123"
  };
  const result2 = new userModel(dummyUser2);
  await result2.save();

  const dummyHouse1 = {
    houseName: "Test House",
    state: "California",
    country: "USA",
    town: "San Luis Obispo",
    createdBy: result1._id
  };

  const addedHouse1 = new houseModel(dummyHouse1);
  await addedHouse1.save();

  const dummyHouse2 = {
    houseName: "Sunset Villa",
    state: "Texas",
    country: "USA",
    town: "Austin",
    createdBy: result1._id
  };

  const addedHouse2 = new houseModel(dummyHouse2);
  await addedHouse2.save();

  const dummyHouse3 = {
    houseName: "Maple Cottage",
    state: "New York",
    country: "USA",
    town: "Ithaca",
    createdBy: result2._id
  };

  const addedHouse3 = new houseModel(dummyHouse3);
  await addedHouse3.save();
});

afterEach(async () => {
  await userModel.deleteMany();
  await houseModel.deleteMany();
});

test("Getting Houses", async () => {
  const houses = await houseServices.getHouses();
  expect(houses).toBeTruthy();
  expect(houses.length).toBe(3);
});

test("Creating House -- successful", async () => {
  const dummyUser = {
    name: "cnorris",
    email: "cnorris123@gmailexample.com",
    password: "password123"
  };
  const user = await userServices.addUser(dummyUser);

  const dummyHouse = {
    houseName: "Ocean Breeze Retreat",
    state: "Florida",
    country: "USA",
    town: "Miami",
    createdBy: user._id
  };

  const result = await houseServices.createHouse(dummyHouse);
  expect(result).toBeTruthy();
  expect(result.houseName).toBe(dummyHouse.houseName);
  expect(result.state).toBe(dummyHouse.state);
  expect(result.country).toBe(dummyHouse.country);
  expect(result.town).toBe(dummyHouse.town);
  expect(result.createdBy).toBe(dummyHouse.createdBy);
  expect(result._id).toBeTruthy();

  const houses = await houseServices.getHouses();
  expect(houses).toBeTruthy();
  expect(houses.length).toBe(4);
});

test("Creating House -- forgot state unsuccessful", async () => {
  const dummyUser = {
    name: "cnorris",
    email: "cnorris123@gmailexample.com",
    password: "password123"
  };
  const user = await userServices.addUser(dummyUser);

  const dummyHouse = {
    country: "USA",
    town: "Miami",
    createdBy: user._id
  };

  const result = await houseServices.createHouse(dummyHouse);
  expect(result).toBeFalsy();

  const houses = await houseServices.getHouses();
  expect(houses).toBeTruthy();
  expect(houses.length).toBe(3);
});

test("Adding Food to House -- successful", async () => {
  const dummyUser = {
    name: "cnorris",
    email: "cnorris123@gmailexample.com",
    password: "password123"
  };
  const user = await userServices.addUser(dummyUser);

  const dummyHouse = {
    houseName: "Ocean Breeze Retreat",
    state: "Florida",
    country: "USA",
    town: "Miami",
    createdBy: user._id
  };

  const house = await houseServices.createHouse(dummyHouse);

  const dummyFood = {
    FoodName: "Apple",
    FoodType: "Fruit",
    Amount: 10,
    Location: "fridge",
    ExpirationDate: new Date("5/21/2026")
  };

  const result = await houseServices.addFoodToHouse(
    house._id,
    dummyFood.Location,
    dummyFood
  );

  expect(result.success).toBeTruthy();
  expect(result.savedFood.FoodName).toBe(dummyFood.FoodName);
  expect(result.savedFood.FoodType).toBe(dummyFood.FoodType);
});

test("Adding Food to House -- unsuccessful due to House not found", async () => {
  const dummyUser = {
    name: "cnorris",
    email: "cnorris123@gmailexample.com",
    password: "password123"
  };
  const user = await userServices.addUser(dummyUser);

  const dummyHouse = {
    houseName: "Ocean Breeze Retreat",
    state: "Florida",
    country: "USA",
    town: "Miami",
    createdBy: user._id
  };

  const house = await houseServices.createHouse(dummyHouse);
  await houseServices.deleteHouseById(house._id);

  const dummyFood = {
    FoodName: "Apple",
    FoodType: "Fruit",
    Amount: 10,
    Location: "fridge",
    ExpirationDate: new Date("5/21/2026")
  };

  const result = await houseServices.addFoodToHouse(
    house._id,
    dummyFood.Location,
    dummyFood
  );
  expect(result.success).toBeFalsy();
  expect(result.message).toBe("House not found");
});

test("Adding Food to House -- unsuccessful due to invalid House id", async () => {
  const dummyUser = {
    name: "cnorris",
    email: "cnorris123@gmailexample.com",
    password: "password123"
  };
  const user = await userServices.addUser(dummyUser);

  const dummyHouse = {
    houseName: "Ocean Breeze Retreat",
    state: "Florida",
    country: "USA",
    town: "Miami",
    createdBy: user._id
  };

  const house = await houseServices.createHouse(dummyHouse);

  const dummyFood = {
    FoodName: "Apple",
    FoodType: "Fruit",
    Amount: 10,
    Location: "fridge",
    ExpirationDate: new Date("5/21/2026")
  };

  const result = await houseServices.addFoodToHouse(
    "123",
    dummyFood.Location,
    dummyFood
  );
  expect(result.success).toBeFalsy();
  expect(result.message).toBe("Error adding food");
});

test("Adding Food to House -- unsuccessful due to invalid food item", async () => {
  const dummyUser = {
    name: "cnorris",
    email: "cnorris123@gmailexample.com",
    password: "password123"
  };
  const user = await userServices.addUser(dummyUser);

  const dummyHouse = {
    houseName: "Ocean Breeze Retreat",
    state: "Florida",
    country: "USA",
    town: "Miami",
    createdBy: user._id
  };

  const house = await houseServices.createHouse(dummyHouse);

  const dummyFood = {
    FoodName: "Apple",
    FoodType: "Fruit",
    Amount: 10,
    Location: "somewhere random",
    ExpirationDate: new Date("5/21/2026")
  };

  const result = await houseServices.addFoodToHouse(
    house._id,
    dummyFood.Location,
    dummyFood
  );
  expect(result.success).toBeFalsy();
  expect(result.message).toBe("Invalid food item");
});

test("Get Food From House -- successful retrieval from valid location", async () => {
  const house = await houseModel.findOne({
    houseName: "Test House"
  });

  // Add dummy food to fridge
  house.fridge = [
    {
      FoodName: "Banana",
      FoodType: "Fruit",
      Amount: 5,
      Location: "fridge",
      ExpirationDate: new Date("2026-12-31")
    }
  ];
  await house.save();

  const result = await houseServices.getFoodFromHouse(
    house._id,
    "fridge"
  );

  expect(result.success).toBeTruthy();
  expect(Array.isArray(result.foodItems)).toBeTruthy();
  expect(result.foodItems.length).toBe(1);
  expect(result.foodItems[0].FoodName).toBe("Banana");
});

test("Get Food From House -- unsuccessful due to house not found", async () => {
  // Delete an existing house and use its ID
  const dummyHouse = await houseModel.findOne({
    houseName: "Sunset Villa"
  });
  await houseModel.deleteOne({ _id: dummyHouse._id });

  const result = await houseServices.getFoodFromHouse(
    dummyHouse._id,
    "fridge"
  );

  expect(result.success).toBeFalsy();
  expect(result.message).toBe("House not found");
});

test("Get Food From House -- unsuccessful due to invalid location", async () => {
  const house = await houseModel.findOne({
    houseName: "Maple Cottage"
  });

  const result = await houseServices.getFoodFromHouse(
    house._id,
    "bathtub"
  );

  expect(result.success).toBeFalsy();
  expect(result.message).toBe("Invalid location");
});

test("Get Food From House -- error case with invalid house ID", async () => {
  const result = await houseServices.getFoodFromHouse(
    "invalidid123",
    "fridge"
  );

  expect(result.success).toBeFalsy();
  expect(result.message).toBe("Error fetching food");
});

test("Get all food from house — successful", async () => {
  const house = await houseModel.findOne({
    houseName: "Test House"
  });

  house.fridge.push({
    FoodName: "Milk",
    FoodType: "Dairy",
    Amount: 1,
    Location: "fridge",
    ExpirationDate: new Date("2025-12-01")
  });

  house.freezer.push({
    FoodName: "Ice Cream",
    FoodType: "Sugars & Sweets",
    Amount: 2,
    Location: "freezer",
    ExpirationDate: new Date("2025-12-25")
  });

  house.pantry.push({
    FoodName: "Pasta",
    FoodType: "Grains",
    Amount: 3,
    Location: "pantry",
    ExpirationDate: new Date("2026-01-01")
  });

  await house.save();

  const result = await houseServices.getAllFoodFromHouse(
    house._id
  );
  expect(result.success).toBeTruthy();
  expect(result.foodItems.length).toBe(3);
  expect(result.foodItems.map((f) => f.FoodName)).toEqual(
    expect.arrayContaining(["Milk", "Ice Cream", "Pasta"])
  );
});

test("Get all food from house — house not found", async () => {
  const result = await houseServices.getAllFoodFromHouse(
    new mongoose.Types.ObjectId()
  );
  expect(result.success).toBeFalsy();
  expect(result.message).toBe("House not found");
});

test("Get all food from house — invalid house ID causes error", async () => {
  const result =
    await houseServices.getAllFoodFromHouse("invalid-id");
  expect(result.success).toBeFalsy();
  expect(result.message).toBe("Error fetching food");
});

test("Removes food item from fridge", async () => {
  const house = await houseModel.findOne({
    houseName: "Test House"
  });

  const foodItem = {
    FoodName: "Yogurt",
    FoodType: "Dairy",
    Amount: 1,
    Location: "fridge",
    ExpirationDate: new Date("2025-10-01")
  };

  house.fridge.push(foodItem);
  await house.save();

  const foodId = house.fridge[0]._id;
  const result = await houseServices.removeFoodFromHouse(
    house._id,
    foodId
  );

  expect(result.success).toBeTruthy();
  expect(result.message).toBe("Food removed from house");

  const updatedHouse = await houseModel.findById(house._id);
  expect(
    updatedHouse.fridge.find((f) => f._id.equals(foodId))
  ).toBeUndefined();
});

test("Removes food item from pantry", async () => {
  const house = await houseModel.findOne({
    houseName: "Test House"
  });

  const foodItem = {
    FoodName: "Beans",
    FoodType: "Vegetable",
    Amount: 1,
    Location: "pantry",
    ExpirationDate: new Date("2026-01-01")
  };

  house.pantry.push(foodItem);
  await house.save();

  const foodId = house.pantry[0]._id;
  const result = await houseServices.removeFoodFromHouse(
    house._id,
    foodId
  );

  expect(result.success).toBeTruthy();
  expect(result.message).toBe("Food removed from house");

  const updatedHouse = await houseModel.findById(house._id);
  expect(
    updatedHouse.pantry.find((f) => f._id.equals(foodId))
  ).toBeUndefined();
});

test("Returns message when food is not found in house", async () => {
  const house = await houseModel.findOne({
    houseName: "Test House"
  });

  const fakeFoodId = new mongoose.Types.ObjectId();
  const result = await houseServices.removeFoodFromHouse(
    house._id,
    fakeFoodId
  );

  expect(result.success).toBeFalsy();
  expect(result.message).toBe("Food not found in house");
});

test("Returns error when house is not found", async () => {
  const fakeHouseId = new mongoose.Types.ObjectId();
  const fakeFoodId = new mongoose.Types.ObjectId();

  const result = await houseServices.removeFoodFromHouse(
    fakeHouseId,
    fakeFoodId
  );

  expect(result.success).toBeFalsy();
  expect(result.message).toBe("House not found");
});

test("Handles invalid house ID format gracefully", async () => {
  const result = await houseServices.removeFoodFromHouse(
    "bad-id",
    "some-food-id"
  );

  expect(result.success).toBeFalsy();
  expect(result.message).toBe("Error updating house");
});

test("Delete House by id -- unsuccessful due to house not found", async () => {
  // Delete an existing house and use its ID
  const dummyHouse = await houseModel.findOne({
    houseName: "Sunset Villa"
  });
  await houseModel.deleteOne({ _id: dummyHouse._id });

  const result = await houseServices.deleteHouseById(
    dummyHouse._id
  );

  expect(result).toBeFalsy();
});

test("Delete House by id -- unsuccessful due to house id format", async () => {
  const result = await houseServices.deleteHouseById("123");
  expect(result).toBeFalsy();
});

test("Successfully finds a house by ID", async () => {
  const house = await houseModel.findOne({
    houseName: "Test House"
  });

  const result = await houseServices.findHouseById(house._id);

  expect(result.success).toBeTruthy();
  expect(result.house._id.toString()).toBe(
    house._id.toString()
  );
  expect(result.house.houseName).toBe("Test House");
});

test("Returns message when house is not found", async () => {
  const fakeId = new mongoose.Types.ObjectId();
  const result = await houseServices.findHouseById(fakeId);

  expect(result.success).toBeFalsy();
  expect(result.message).toBe("House not found");
});

test("Handles invalid house ID format", async () => {
  const result =
    await houseServices.findHouseById("invalid-id");

  expect(result.success).toBeFalsy();
  expect(result.message).toBe("Error finding house");
});
