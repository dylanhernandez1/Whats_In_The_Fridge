import mongoose from "mongoose";
import UserSchema from "../user.js";
import userServices from "../user-services.js";
import houseSchema from "../house.js";
import houseServices from "../house-services.js";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;
let conn;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  conn = await mongoose.createConnection(uri);

  userModel = conn.model("User", UserSchema);
  houseModel = conn.model("House", houseSchema);

  userServices.setConnection(conn);
  houseServices.setConnection(conn);
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

  const dummyUser3 = {
    name: "Jackie Chan",
    email: "jackiechan@example.com",
    password: "password123"
  };
  const result3 = new userModel(dummyUser3);
  await result3.save();

  const dummyUser4 = {
    name: "Jean-Claude Van Damme",
    email: "jcvd@example.com",
    password: "password123"
  };
  const result4 = new userModel(dummyUser4);
  await result4.save();

  const dummyUser5 = {
    name: "Sylvester Stallone",
    email: "sly@example.com",
    password: "password123"
  };
  const result5 = new userModel(dummyUser5);
  await result5.save();
});

afterEach(async () => {
  await userModel.deleteMany();
  await houseModel.deleteMany();
});

test("Fetching all users", async () => {
  const users = await userServices.getUsers();
  expect(users).toBeDefined();
  expect(users.length).toBeGreaterThan(0);
  expect(users.length).toBe(5);
});

test("Adding user -- successful path", async () => {
  const dummyUser = {
    name: "Dumbledore",
    email: "dumbledore@example.com",
    password: "password123"
  };
  const result = await userServices.addUser(dummyUser);
  expect(result).toBeTruthy();
  expect(result.email).toBe(dummyUser.email);
  expect(result.name).toBe(dummyUser.name);
  const users = await userServices.getUsers();
  expect(users.length).toBe(6);
});

test("Adding user -- email and password are required", async () => {
  const dummyUser = { name: "Gandalf" }; // Missing email and password
  try {
    await userServices.addUser(dummyUser);
  } catch (e) {
    expect(e.message).toBe("Email and password are required.");
  }
});

test("Finding user by ID -- valid ID", async () => {
  const dummyUser = {
    name: "Frodo",
    email: "frodo@example.com",
    password: "password123"
  };
  const result = await userServices.addUser(dummyUser);

  const foundUser = await userServices.findUserById(result._id);
  expect(foundUser).toBeDefined();
  expect(foundUser._id.toString()).toBe(result._id.toString());
});

test("Finding user by ID -- invalid ID", async () => {
  const foundUser =
    await userServices.findUserById("invalidId");
  expect(foundUser).toBeNull();
});

test("Deleting user by ID -- successful path", async () => {
  const dummyUser = {
    name: "Aragorn",
    email: "aragorn@example.com",
    password: "password123"
  };
  const result = await userServices.addUser(dummyUser);

  const deletedUser = await userServices.deleteUserById(
    result._id
  );
  expect(deletedUser).toBeDefined();
  expect(deletedUser._id.toString()).toBe(
    result._id.toString()
  );
  const users = await userServices.getUsers();
  expect(users.length).toBe(5);
});

test("Deleting user by ID -- invalid ID", async () => {
  const deletedUser =
    await userServices.deleteUserById("invalidId");
  expect(deletedUser).toBeFalsy();
});

test("Deleting user by email -- successful path", async () => {
  const dummyUser = {
    name: "Legolas",
    email: "legolas@example.com",
    password: "password123"
  };
  const result = await userServices.addUser(dummyUser);

  const deletedUser = await userServices.deleteUserByEmail(
    result.email
  );
  expect(deletedUser).toBeDefined();
  expect(deletedUser.email).toBe(result.email);
});

test("Deleting user by email -- not found", async () => {
  const deletedUser = await userServices.deleteUserByEmail(
    "nonexistent@example.com"
  );
  expect(deletedUser).toBeNull();
});

test("Finding user by email -- found", async () => {
  const dummyUser = {
    name: "Luke Skywalker",
    email: "DarthSon@gmail.com",
    password: "password123"
  };
  const result = await userServices.addUser(dummyUser);

  const foundUser = await userServices.findUserByEmail(
    result.email
  );

  expect(foundUser).toBeDefined();
  expect(foundUser._id.toString()).toBe(result._id.toString());
});

test("Adding User failue -- email in use", async () => {
  const dummyUser = {
    name: "JackieChanJr",
    email: "jackiechan@example.com",
    password: "password123"
  };
  const result = await userServices.addUser(dummyUser);

  expect(result.status).toBeFalsy();
  expect(result.message).toBe("Email already registered.");
});

test("Adding User failure -- name in use", async () => {
  const dummyUser = {
    name: "Jackie Chan",
    email: "jackiechan1234@example.com",
    password: "password123"
  };
  const result = await userServices.addUser(dummyUser);

  expect(result.status).toBeFalsy();
  expect(result.message).toBe("Name not available");
});

test("Getting user by id -- successful", async () => {
  const dummyUser = {
    name: "Luke Skywalker",
    email: "DarthSon@gmail.com",
    password: "password123"
  };
  const addedUser = await userServices.addUser(dummyUser);

  const result = await userServices.getUsers({
    id: addedUser._id
  });

  expect(result).toBeDefined();
  expect(result._id.toString()).toBe(addedUser._id.toString());
});

test("Deleting user by email -- unsuccessful", async () => {
  const dummyUser = {
    name: "Luke Skywalker",
    email: "DarthSon@gmail.com",
    password: "password123"
  };
  await userServices.addUser(dummyUser);

  const deletedUser = await userServices.deleteUserByEmail(
    "DarthSon1234@gmail.com"
  );

  expect(deletedUser).toBeFalsy();
});

test("Setting user default house -- successful", async () => {
  const dummyUser = {
    name: "Luke Skywalker",
    email: "DarthSon@gmail.com",
    password: "password123"
  };
  const addedUser = await userServices.addUser(dummyUser);

  expect(addedUser.defaultHouse).toBeFalsy();

  const dummyHouse = {
    houseName: "Test House",
    state: "California",
    country: "USA",
    town: "San Luis Obispo",
    createdBy: addedUser._id
  };

  const addedHouse =
    await houseServices.createHouse(dummyHouse);

  expect(addedHouse).toBeTruthy();

  const result = await userServices.setDefaultHouse(
    addedUser,
    addedHouse._id
  );

  expect(result).toBeTruthy();
  expect(addedUser.defaultHouse).toBeDefined();
  expect(addedUser.defaultHouse).toBe(addedHouse._id);
});

test("Setting user default house -- unsuccessful due to bad id", async () => {
  const dummyUser = {
    name: "Luke Skywalker",
    email: "DarthSon@gmail.com",
    password: "password123"
  };
  const addedUser = await userServices.addUser(dummyUser);

  expect(addedUser.defaultHouse).toBeFalsy();

  const result = await userServices.setDefaultHouse(
    addedUser,
    "123"
  );

  expect(result).toBeFalsy();
  expect(addedUser.defaultHouse).toBeFalsy();
});

test("Adding friends to User", async () => {
  const user1 = await userServices.getUsers({
    email: "cnor123@gmailexample.com"
  });
  const user2 = await userServices.getUsers({
    email: "jackiechan@example.com"
  });
  const dummyUser = {
    name: "Luke Skywalker",
    email: "DarthSon@gmail.com",
    password: "password123"
  };
  const addedUser = await userServices.addUser(dummyUser);

  expect(addedUser.friends.length).toBe(0);

  const result = await userServices.addFriend(
    addedUser,
    user1._id
  );

  expect(result).toBeTruthy();
  expect(addedUser.friends.length).toBe(1);
  expect(addedUser.friends[0].toString()).toBe(
    user1._id.toString()
  );

  const result1 = await userServices.addFriend(
    addedUser,
    user2._id
  );
  expect(result1).toBeTruthy();
  expect(addedUser.friends.length).toBe(2);
});

test("Adding friend to User -- failure invalid id", async () => {
  const user1 = await userServices.getUsers({
    email: "cnor123@gmailexample.com"
  });
  const user2 = await userServices.getUsers({
    email: "jackiechan@example.com"
  });
  const dummyUser = {
    name: "Luke Skywalker",
    email: "DarthSon@gmail.com",
    password: "password123"
  };
  const addedUser = await userServices.addUser(dummyUser);

  const result = await userServices.addFriend(addedUser, 123);

  expect(result).toBeFalsy();
});

test("Updating user by ID -- successful update", async () => {
  const user = await userServices.getUsers({
    email: "cnor123@gmailexample.com"
  });

  const updatedFields = {
    name: "Chuck Norris Prime",
    password: "evenMoreSecurePassword456"
  };

  const updatedUser = await userServices.updateUserById(user._id, updatedFields);

  expect(updatedUser).toBeTruthy();
  expect(updatedUser.name).toBe("Chuck Norris Prime");
  expect(updatedUser.email).toBe("cnor123@gmailexample.com"); // unchanged
});

test("Updating user by ID -- invalid ID", async () => {
  const updatedFields = {
    name: "Invalid Update"
  };

  const updatedUser = await userServices.updateUserById("123", updatedFields);

  expect(updatedUser).toBeNull();
});

test("Updating user by ID -- non-existent valid ObjectId", async () => {
  const nonExistentId = new mongoose.Types.ObjectId(); // creates a valid but unused ObjectId

  const updatedUser = await userServices.updateUserById(nonExistentId.toString(), {
    name: "Ghost User"
  });

  expect(updatedUser).toBeNull();
});

test("Verifying user by email — successful path", async () => {
  const dummyUser = {
    name: "Hermione Granger",
    email: "hermione@example.com",
    password: "spell123"
  };

  const addedUser = await userServices.addUser(dummyUser);
  expect(addedUser.emailVerified).toBeFalsy();

  const result = await userServices.verifyUserByEmail(addedUser.email);
  expect(result).toBe(true);

  const verifiedUser = await userServices.findUserByEmail(addedUser.email);
  expect(verifiedUser.emailVerified).toBe(true);
});

test("Verifying user by email — user not found", async () => {
  const result = await userServices.verifyUserByEmail("nonexistent@example.com");
  expect(result).toBe(false);
});
