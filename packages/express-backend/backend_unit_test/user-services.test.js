import mongoose from "mongoose";
import UserSchema from "../user.js";
import userServices from "../user-services.js";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;
let conn;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  conn = await mongoose.createConnection(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  userModel = conn.model("User", UserSchema);

  userServices.setConnection(conn);
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
});

test("Fetching all users", async () => {
  const users = await userServices.getUsers();
  expect(users).toBeDefined();
  expect(users.length).toBeGreaterThan(0);
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
  const foundUser = await userServices.findUserById("invalidId");
  expect(foundUser).toBeNull();
});

test("Deleting user by ID -- successful path", async () => {
  const dummyUser = {
    name: "Aragorn",
    email: "aragorn@example.com",
    password: "password123"
  };
  const result = await userServices.addUser(dummyUser);

  const deletedUser = await userServices.deleteUserById(result._id);
  expect(deletedUser).toBeDefined();
  expect(deletedUser._id.toString()).toBe(result._id.toString());
});

test("Deleting user by ID -- invalid ID", async () => {
  const deletedUser = await userServices.deleteUserById("invalidId");
  expect(deletedUser).toBeFalsy();
});

test("Deleting user by email -- successful path", async () => {
  const dummyUser = {
    name: "Legolas",
    email: "legolas@example.com",
    password: "password123"
  };
  const result = await userServices.addUser(dummyUser);

  const deletedUser = await userServices.deleteUserByEmail(result.email);
  expect(deletedUser).toBeDefined();
  expect(deletedUser.email).toBe(result.email);
});

test("Deleting user by email -- not found", async () => {
  const deletedUser = await userServices.deleteUserByEmail("nonexistent@example.com");
  expect(deletedUser).toBeNull();
});

test("Finding user by email -- found", async () => {
  const dummyUser = {
    name: "Luke Skywalker",
    email: "DarthSon@gmail.com",
    password: "password123"
  };
  const result = await userServices.addUser(dummyUser);

  const foundUser = await userServices.findUserByEmail(result.email);

  expect(foundUser).toBeDefined();
  expect(foundUser._id.toString()).toBe(result._id.toString());
});