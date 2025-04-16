import userServices from "../user-services.js";
import mongoose from "mongoose";
import UserSchema from "../user.js";

let mockFind;
let mockSave;
let mockFindById;
let mockModel;
let mockConnection;

beforeEach(() => {
  jest.clearAllMocks();

  // Set up mock functions
  mockFind = jest.fn();
  mockSave = jest.fn();
  mockFindById = jest.fn();

  // Create a mock model object for static methods like .find
  mockModel = function () {
    return { save: mockSave };
  };
  mockModel.find = mockFind;
  mockModel.findById = mockFindById;

  // Create a mock connection that returns the mock model
  mockConnection = {
    model: jest.fn(() => mockModel)
  };

  // Inject the mock connection into the service
  userServices.setConnection(mockConnection);
});

test("fetching all users", async () => {
  mockFind.mockResolvedValue([{ name: "John Doe" }]);

  const users = await userServices.getUsers();

  expect(users).toBeDefined();
  expect(users.length).toBe(1);
  expect(users[0].name).toBe("John Doe");
  expect(mockFind).toHaveBeenCalledTimes(1);
});

test("adding user", async () => {
  const newUser = {
    name: "John Doe",
    email: "jdoe@example.com",
    password: "password123" // Include the password now
  };

  mockSave.mockResolvedValue(newUser);

  const result = await userServices.addUser(newUser);

  expect(result).toEqual(newUser);
  expect(mockSave).toHaveBeenCalledTimes(1);
});

test("finding user by id", async () => {
  const user = {
    name: "John Doe",
    email: "desperatelyneedjob@example.com",
    password: "password123"
  };

  const mockId = new mongoose.Types.ObjectId().toString();

  mockFindById.mockResolvedValue(user);

  const result = await userServices.findUserById(mockId);

  expect(result).toEqual(user);
  expect(mockFindById).toHaveBeenCalledTimes(1);
});

test("finding user by name", async () => {
  mockFind.mockResolvedValue([
    {
      name: "John Doe",
      email: "desperatelyneedjob@example.com",
      password: "password123"
    },
    {
      name: "jajaja",
      email: "desperatelyneedjob@example.com",
      password: "password123"
    }
  ]);

  const user = {
    name: "John Doe",
    email: "desperatelyneedjob@example.com",
    password: "password123"
  };

  const result = await userServices.findUserByName("John Doe");

  expect(result[0]).toEqual(user);
  expect(mockFind).toHaveBeenCalledTimes(1);
});

test("finding user by invalid id --> null", async () => {
  mockFindById.mockResolvedValue(null);

  const result = await userServices.findUserById("invalidID");

  expect(result).toBeNull();
});

test("adding user -- missing name", async () => {
  const newUser = {
    email: "jdoe@example.com",
    password: "password123"
  };

  mockSave.mockResolvedValue(newUser);

  const result = await userServices.addUser(newUser);

  expect(result).toBe(false); // Ensure the user was not added
  expect(mockSave).toHaveBeenCalledTimes(0);
});

test("adding user -- missing email", async () => {
  const newUser = {
    name: "John Doe",
    password: "password123"
  };

  mockSave.mockResolvedValue(newUser);

  const result = await userServices.addUser(newUser);

  expect(result).toBe(false); // Ensure the user was not added
  expect(mockSave).toHaveBeenCalledTimes(0);
});

test("adding user -- missing password", async () => {
  const newUser = {
    name: "John Doe",
    email: "jdoe@example.com"
  };

  mockSave.mockResolvedValue(newUser);

  const result = await userServices.addUser(newUser);

  expect(result).toBe(false); // Ensure the user was not added
  expect(mockSave).toHaveBeenCalledTimes(0);
});

test("findUserById handles exception", async () => {
  const mockId = "507f191e810c19729de860ea";

  // Make mock throw error
  mockFindById.mockImplementation(() => {
    throw new Error("DB error");
  });

  const result = await userServices.findUserById(mockId);

  expect(result).toBeUndefined();
  expect(mockFindById).toHaveBeenCalledTimes(1);
});

test("deleteUserById handles exception", async () => {
  const validId = "507f191e810c19729de860ea";

  // Add mock for findByIdAndDelete
  const mockFindByIdAndDelete = jest.fn(() => {
    throw new Error("Delete error");
  });

  mockModel.findByIdAndDelete = mockFindByIdAndDelete;

  const result = await userServices.deleteUserById(validId);

  expect(result).toBe(false);
  expect(mockFindByIdAndDelete).toHaveBeenCalledTimes(1);
});
