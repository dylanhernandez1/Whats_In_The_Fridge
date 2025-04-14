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
    ExpirationDate: "2025-05-01"
  };

  mockSave.mockResolvedValue(newFood);

  const result = await foodServices.addFood(newFood);

  expect(result).toEqual(newFood);
  expect(mockSave).toHaveBeenCalledTimes(1);
});
