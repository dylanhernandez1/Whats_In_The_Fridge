import mongoose from "mongoose";
import UserSchema from "../user.js";
import userServices from "../user-services.js";
import houseSchema from "../house.js";
import houseServices from "../house-services.js";
import UserHouseSchema from "../UserHouse.js";
import userHouseServices from "../UserHouse-services.js";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;
let conn;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  conn = await mongoose.createConnection(uri);

  userModel = conn.model("User", UserSchema);
  houseModel = conn.model("House", houseSchema);
  userHouseModel = conn.model("UserHouse", UserHouseSchema);

  userServices.setConnection(conn);
  houseServices.setConnection(conn);
  userHouseServices.setConnection(conn);
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
  await userHouseModel.deleteMany();
});

test("Adding user to a house -- success", async () => {
  const user = await userServices.getUsers({
    email: "cnor123@gmailexample.com"
  });
  const dummyHouse = {
    houseName: "Rocklin House",
    state: "CA",
    country: "USA",
    town: "Rocklin",
    createdBy: user._id
  };

  const house = new houseModel(dummyHouse);
  await house.save();

  const result = await userHouseServices.addUserToHouse(
    user._id,
    house._id,
    "owner"
  );

  expect(result.success).toBeTruthy();
  expect(result.savedUserHouse.user.toString()).toBe(
    user._id.toString()
  );
  expect(result.savedUserHouse.house.toString()).toBe(
    house._id.toString()
  );
  expect(result.savedUserHouse.role).toBe("owner");
});

test("Adding same user to house again should fail", async () => {
  const user = await userServices.getUsers({
    email: "cnor123@gmailexample.com"
  });
  const house = await houseModel.findOne({
    houseName: "Test House"
  });

  await userHouseServices.addUserToHouse(
    user._id,
    house._id,
    "member"
  );

  const result = await userHouseServices.addUserToHouse(
    user._id,
    house._id,
    "member"
  );

  expect(result.success).toBeFalsy();
  expect(result.message).toBe(
    "User is already part of the house."
  );
});

test("Remove user from house", async () => {
  const user = await userServices.getUsers({
    email: "brucelee@example.com"
  });
  const house = await houseModel.findOne({
    houseName: "Sunset Villa"
  });

  await userHouseServices.addUserToHouse(user._id, house._id);
  const result = await userHouseServices.removeUserFromHouse(
    user._id,
    house._id
  );

  expect(result.success).toBeTruthy();
  expect(result.removedUserHouse.user.toString()).toBe(
    user._id.toString()
  );
});

test("Remove user from house when not in house", async () => {
  const user = await userServices.getUsers({
    email: "brucelee@example.com"
  });
  const house = await houseModel.findOne({
    houseName: "Maple Cottage"
  });

  const result = await userHouseServices.removeUserFromHouse(
    user._id,
    house._id
  );

  expect(result.success).toBeFalsy();
  expect(result.message).toBe("User is not part of the house.");
});

test("Change user role in house", async () => {
  const user = await userServices.getUsers({
    email: "cnor123@gmailexample.com"
  });
  const house = await houseModel.findOne({
    houseName: "Test House"
  });

  await userHouseServices.addUserToHouse(
    user._id,
    house._id,
    "member"
  );
  const result = await userHouseServices.changeUserRoleInHouse(
    user._id,
    house._id,
    "owner"
  );

  expect(result.success).toBeTruthy();
  expect(result.updatedUserHouse.role).toBe("owner");
});

test("Change user role in house with invalid role", async () => {
  const user = await userServices.getUsers({
    email: "cnor123@gmailexample.com"
  });
  const house = await houseModel.findOne({
    houseName: "Test House"
  });

  const result = await userHouseServices.changeUserRoleInHouse(
    user._id,
    house._id,
    "admin"
  );

  expect(result.success).toBeFalsy();
  expect(result.message).toBe("Invalid role.");
});

test("Change user role when user is not part of the house", async () => {
  const user = await userServices.getUsers({
    email: "brucelee@example.com"
  });
  const house = await houseModel.findOne({
    houseName: "Sunset Villa"
  });

  const result = await userHouseServices.changeUserRoleInHouse(
    user._id,
    house._id,
    "owner"
  );

  expect(result.success).toBeFalsy();
  expect(result.message).toBe("User is not part of the house.");
});

test("Get users in a house", async () => {
  const user = await userServices.getUsers({
    email: "cnor123@gmailexample.com"
  });
  const house = await houseModel.findOne({
    houseName: "Test House"
  });

  await userHouseServices.addUserToHouse(
    user._id,
    house._id,
    "member"
  );
  const result = await userHouseServices.getUsersInHouse(
    house._id
  );

  expect(result.success).toBeTruthy();
  expect(result.usersInHouse.length).toBe(1);
  expect(result.usersInHouse[0].user.email).toBe(
    "cnor123@gmailexample.com"
  );
});

test("Get houses by user", async () => {
  const user = await userServices.getUsers({
    email: "brucelee@example.com"
  });
  const house = await houseModel.findOne({
    houseName: "Maple Cottage"
  });

  await userHouseServices.addUserToHouse(
    user._id,
    house._id,
    "owner"
  );
  const result = await userHouseServices.getHousesByUser(
    user._id
  );

  expect(result.success).toBeTruthy();
  expect(result.housesByUser.length).toBe(1);
  expect(result.housesByUser[0].house.houseName).toBe(
    "Maple Cottage"
  );
});

test("findUserHouse - success", async () => {
  const user = await userServices.getUsers({
    email: "cnor123@gmailexample.com"
  });
  const house = await houseModel.findOne({
    houseName: "Test House"
  });

  await userHouseServices.addUserToHouse(
    user._id,
    house._id,
    "member"
  );

  const result = await userHouseServices.findUserHouse(
    user._id,
    house._id
  );

  expect(result.success).toBeTruthy();
  expect(result.userHouse).toBeDefined();
  expect(result.userHouse.user.toString()).toBe(
    user._id.toString()
  );
  expect(result.userHouse.house.toString()).toBe(
    house._id.toString()
  );
});

test("findUserHouse - user not in house", async () => {
  const user = await userServices.getUsers({
    email: "brucelee@example.com"
  });
  const house = await houseModel.findOne({
    houseName: "Test House"
  });

  const result = await userHouseServices.findUserHouse(
    user._id,
    house._id
  );

  expect(result.success).toBeTruthy(); // Query succeeds, but no match found
  expect(result.userHouse).toBeNull();
});

test("findUserHouse - database error", async () => {
  const userId = new mongoose.Types.ObjectId();
  const houseId = new mongoose.Types.ObjectId();

  const originalModel = conn.model;
  conn.model = jest.fn().mockImplementation(() => ({
    findOne: () => {
      throw new Error("DB error");
    }
  }));

  const result = await userHouseServices.findUserHouse(
    userId,
    houseId
  );
  expect(result.success).toBeFalsy();
  expect(result.message).toBe(
    "Error retrieving user house object"
  );

  conn.model = originalModel; // Restore original method
});
