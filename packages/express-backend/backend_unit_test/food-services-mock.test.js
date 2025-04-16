import foodServices from "../food-services.js";
import mongoose from "mongoose";
import FoodSchema from "../food-item.js";

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
  foodServices.setConnection(mockConnection);
});

test("fetching all food", async () => {
  mockFind.mockResolvedValue([{ FoodName: "Orange" }]);

  const foodItems = await foodServices.getFood();

  expect(foodItems).toBeDefined();
  expect(foodItems.length).toBe(1);
  expect(foodItems[0].FoodName).toBe("Orange");
  expect(mockFind).toHaveBeenCalledTimes(1);
});

test("adding food with ExpirationDate", async () => {
  const newFood = {
    FoodName: "Banana",
    ExpirationDate: "2025-05-01",
    Amount: 1,
    Location: "Fridge"
  };

  mockSave.mockResolvedValue(newFood);

  const result = await foodServices.addFood(newFood);
  expect(result).toEqual(newFood);
  expect(mockSave).toHaveBeenCalledTimes(1);
});

test("adding food with amount", async () => {
  const newFood = {
    FoodName: "Banana",
    ExpirationDate: "2025-05-01",
    Amount: 1,
    Location: "Pantry"
  };

  mockSave.mockResolvedValue(newFood);

  const result = await foodServices.addFood(newFood);

  expect(result.Amount).toEqual(newFood.Amount);
  expect(mockSave).toHaveBeenCalledTimes(1);
});

test("testing with invalid name", async () => {
  const newFood = {
    ExpirationDate: "2025-05-01"
  };

  mockSave.mockResolvedValue(newFood);

  const result = await foodServices.addFood(newFood);

  expect(result).toBe(false);
  expect(mockSave).toHaveBeenCalledTimes(0);
});

test("testing food isn't less than or equal to zero", async () => {
  const newFood = {
    FoodName: "Banana",
    ExpirationDate: "2025-05-01",
    Amount: 0,
    Location: "Freezer"
  };

  mockSave.mockResolvedValue(newFood);

  const result = await foodServices.addFood(newFood);

  expect(result).toBe(false);
  expect(mockSave).toHaveBeenCalledTimes(0);
});

test("testing food name not provided", async () => {
  const newFood = {
    ExpirationDate: "2025-05-01",
    Amount: 1,
    Location: "Fridge"
  };

  mockSave.mockResolvedValue(newFood);

  const result = await foodServices.addFood(newFood);

  expect(result).toBe(false);
  expect(mockSave).toHaveBeenCalledTimes(0);
});

test("testing location invalid", async () => {
  const newFood = {
    FoodName: "Cocaine",
    ExpirationDate: "2025-05-01",
    Location: "Chinese Buffet",
    Amount: 1
  };

  mockSave.mockResolvedValue(newFood);

  const result = await foodServices.addFood(newFood);

  expect(result).toBe(false);
  expect(mockSave).toHaveBeenCalledTimes(0);
});

test("find invalid food", async () => {
  const newFood = {
    FoodName: "Cocaine",
    ExpirationDate: "2025-05-01",
    Location: "Chinese Buffet",
    Amount: 1
  };

  mockFind.mockResolvedValue([{ newFood }]);

  const result = await foodServices.getFood("Weed");

  expect(result).toStrictEqual([{ newFood }]);
  expect(mockFind).toHaveBeenCalledTimes(1);
});

test("find food by expiration date", async () => {
  const mockData = [
    { FoodName: "Milk", ExpirationDate: "2025-04-15" },
    { FoodName: "Cheese", ExpirationDate: "2025-04-20" },
  ];

  const mockSort = jest.fn().mockResolvedValue(mockData);
  mockFind.mockReturnValue({ sort: mockSort });

  const result = await foodServices.findFoodByExpiration();

  expect(mockFind).toHaveBeenCalledWith({ ExpirationDate: { $exists: true } });
  expect(mockSort).toHaveBeenCalledWith({ ExpirationDate: 1 });
  expect(result).toEqual(mockData);
  expect(result[0].FoodName).toBe("Milk");
});