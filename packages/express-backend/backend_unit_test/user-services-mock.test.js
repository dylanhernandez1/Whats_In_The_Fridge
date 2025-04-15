import userServices from "../user-services.js";
import mongoose from "mongoose";
import UserSchema from "../user.js";
import { useRevalidator } from "react-router";

let mockFind;
let mockSave;
let mockModel;
let mockConnection;

beforeEach(() => {
  jest.clearAllMocks();

  // Set up mock functions
  mockFind = jest.fn();
  mockSave = jest.fn();

  // Create a mock model object for static methods like .find
  mockModel = function () {
    return { save: mockSave };
  };
  mockModel.find = mockFind;

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

test("finding user by name", async () => {
  mockFind.mockResolvedValue([{
    name: "John Doe",
    job: "Unemployed",
    email: "desperatelyneedjob@example.com"
  },
  {
    name: "jajaja",
    job: "Unemployed",
    email: "desperatelyneedjob@example.com"
  }]);

  const user = {
    name: "John Doe",
    job: "Unemployed",
    email: "desperatelyneedjob@example.com"
  };

  const result = await userServices.findUserByName("John Doe");

  expect(result[0]).toEqual(user);
  expect(mockFind).toHaveBeenCalledTimes(1);
})


test("finding user by job", async () => {
  mockFind.mockResolvedValue([{
    name: "John Doe",
    job: "Unemployed",
    email: "desperatelyneedjob@example.com"
  },
  {
    name: "jajaja",
    job: "Software Engineer",
    email: "ihaveajob@example.com"
  }]);

  const user = {
    name: "John Doe",
    job: "Unemployed",
    email: "desperatelyneedjob@example.com"
  };

  const result = await userServices.findUserByJob("Unemployed");

  expect(result[0]).toEqual(user);
  expect(mockFind).toHaveBeenCalledTimes(1);
})