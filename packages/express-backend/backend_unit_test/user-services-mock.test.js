import userServices from "../user-services.js";
import mongoose from "mongoose";
import UserSchema from "../user.js";
import { useRevalidator } from "react-router";

let mockFind;
let mockSave;
let mockModel;
let mockConnection;
let mockFindById;

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
    job: "Software Engineer",
    email: "jdoe@example.com"
  };

  mockSave.mockResolvedValue(newUser);

  const result = await userServices.addUser(newUser);

  expect(result).toEqual(newUser);
  expect(mockSave).toHaveBeenCalledTimes(1);
});

test("finding user by id", async () => {
  const user = {
    name: "John Doe",
    job: "Unemployed",
    email: "desperatelyneedjob@example.com"
  };

  const mockId = "1234abcd";

  mockFindById.mockResolvedValue(user);

  const result = await userServices.findUserById(mockId);

  expect(result).toEqual(user);
  expect(mockFindById).toHaveBeenCalledTimes(1);
});

test("finding user by name", async () => {
  mockFind.mockResolvedValue([
    {
      name: "John Doe",
      job: "Unemployed",
      email: "desperatelyneedjob@example.com"
    },
    {
      name: "jajaja",
      job: "Unemployed",
      email: "desperatelyneedjob@example.com"
    }
  ]);

  const user = {
    name: "John Doe",
    job: "Unemployed",
    email: "desperatelyneedjob@example.com"
  };

  const result = await userServices.findUserByName("John Doe");

  expect(result[0]).toEqual(user);
  expect(mockFind).toHaveBeenCalledTimes(1);
});

test("finding user by job", async () => {
  mockFind.mockResolvedValue([
    {
      name: "John Doe",
      job: "Unemployed",
      email: "desperatelyneedjob@example.com"
    },
    {
      name: "jajaja",
      job: "Software Engineer",
      email: "ihaveajob@example.com"
    }
  ]);

  const user = {
    name: "John Doe",
    job: "Unemployed",
    email: "desperatelyneedjob@example.com"
  };

  const result = await userServices.findUserByJob("Unemployed");

  expect(result[0]).toEqual(user);
  expect(mockFind).toHaveBeenCalledTimes(1);
});

test("finding user by invalid id --> null", async () => {
  mockFindById.mockResolvedValue(null);

  const result = await userServices.findUserById("invalidID");

  expect(result).toBeNull();
});

test("invalid name", async () => {
  const newUser = {
    job: "Software Engineer",
    email: "jdoe@example.com"
  };

  mockSave.mockResolvedValue(newUser);

  const result = await userServices.addUser(newUser);

  expect(result).toBe(false);
  expect(mockSave).toHaveBeenCalledTimes(0);
});

test("invalid email", async () => {
  const newUser = {
    name: "John Doe",
    job: "Software Engineer"
  };

  mockSave.mockResolvedValue(newUser);

  const result = await userServices.addUser(newUser);

  expect(result).toBe(false);
  expect(mockSave).toHaveBeenCalledTimes(0);
});