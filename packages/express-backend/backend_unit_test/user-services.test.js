import mongoose from "mongoose";
import UserSchema from "../user";
import userServices from "../user-services";
import { MongoMemoryServer } from "mongodb-memory-server";

// Declare mongoServer and conn globally so they can be used in the tests
let mongoServer;
let conn;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  conn = await mongoose.createConnection(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  userModel = conn.model("User", UserSchema)

  userServices.setConnection(conn);
});


afterAll(async () => {
  await conn.dropDatabase();
  await conn.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  let dummyUser1 = {
    name: "Chuck Norris",
    job: "Highlander",
    email: "cnor123@gmailexample.com",
  };
  let result1 = new userModel(dummyUser1);
  await result1.save();

  let dummyUser2 = {
    name: "Bruce Lee",
    job: "Martial Artist",
    email: "brucelee@example.com",
  };
  let result2 = new userModel(dummyUser2);
  await result2.save();

  let dummyUser3 = {
    name: "Jackie Chan",
    job: "Actor",
    email: "jackiechan@example.com",
  };
  let result3 = new userModel(dummyUser3);
  await result3.save();

  let dummyUser4 = {
    name: "Jean-Claude Van Damme",
    job: "Actor",
    email: "jcvd@example.com",
  };
  let result4 = new userModel(dummyUser4);
  await result4.save();

  let dummyUser5 = {
    name: "Sylvester Stallone",
    job: "Actor",
    email: "sly@example.com",
  };
  let result5 = new userModel(dummyUser5);
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
  const dummyUser = { name: "Dumbledore", job: "Headmaster", email: "dumbledore@example.com" };
  const result = await userServices.addUser(dummyUser);
  expect(result).toBeTruthy();
  expect(result.email).toBe(dummyUser.email);
  expect(result.name).toBe(dummyUser.name);
  expect(result.job).toBe(dummyUser.job);
});

test("Fetching users by name", async () => {
  const dummyUser = { name: "Dumbledore", job: "Headmaster", email: "dumbledore@example.com" };
  await userServices.addUser(dummyUser);

  const users = await userServices.getUsers("Dumbledore");
  expect(users).toBeDefined();
  expect(users.length).toBeGreaterThan(0);
  expect(users[0].name).toBe(dummyUser.name);
});

test("Fetching users by job", async () => {
  const dummyUser = { name: "Dumbledore", job: "Headmaster", email: "dumbledore@example.com" };
  await userServices.addUser(dummyUser);

  const users = await userServices.getUsers(undefined, "Headmaster");
  expect(users).toBeDefined();
  expect(users.length).toBeGreaterThan(0);
  expect(users[0].job).toBe(dummyUser.job);
});

test("Fetching users by name and job", async () => {
  const dummyUser = { name: "Dumbledore", job: "Headmaster", email: "dumbledore@example.com" };
  await userServices.addUser(dummyUser);

  const users = await userServices.getUsers("Dumbledore", "Headmaster");
  expect(users).toBeDefined();
  expect(users.length).toBeGreaterThan(0);
  expect(users[0].name).toBe(dummyUser.name);
  expect(users[0].job).toBe(dummyUser.job);
});

test("Adding user -- successful path", async () => {
  const dummyUser = { name: "Gandalf", job: "Wizard", email: "gandalf@example.com" };
  const result = await userServices.addUser(dummyUser);
  expect(result).toBeTruthy();
  expect(result.email).toBe(dummyUser.email);
});

test("Adding user -- email is required", async () => {
  const dummyUser = { name: "Gandalf", job: "Wizard" };
  try {
    await userServices.addUser(dummyUser);
  } catch (e) {
    expect(e.message).toBe("Email is required.");
  }
});

test("Finding user by ID -- valid ID", async () => {
  const dummyUser = { name: "Frodo", job: "Ringbearer", email: "frodo@example.com" };
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
  const dummyUser = { name: "Aragorn", job: "King", email: "aragorn@example.com" };
  const result = await userServices.addUser(dummyUser);

  const deletedUser = await userServices.deleteUserById(result._id);
  expect(deletedUser).toBeDefined();
  expect(deletedUser._id.toString()).toBe(result._id.toString());
});

test("Deleting user by ID -- invalid ID", async () => {
  const deletedUser = await userServices.deleteUserById("invalidId");
  expect(deletedUser).toBeFalsy();
});