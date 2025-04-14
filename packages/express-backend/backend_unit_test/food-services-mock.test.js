import foodServices from "../food-services.js";
import mongoose from "mongoose";
import FoodSchema from "../food-item.js";

let mockFind;

// Create a mock model object
const mockModel = {
  find: jest.fn()
};

// Create a mock connection that returns the mock model
const mockConnection = {
  model: jest.fn(() => mockModel)
};

beforeEach(() => {
  jest.clearAllMocks();

  // Inject the mock connection into the service
  foodServices.setConnection(mockConnection);

  // Reset mockFind
  mockFind = mockModel.find;
});

test("fetching all food", async () => {
  // Arrange mock return value
  mockFind.mockResolvedValue([{ FoodName: "Orange" }]);

  // Act
  const foodItems = await foodServices.getFood();

  // Assert
  expect(foodItems).toBeDefined();
  expect(foodItems.length).toBe(1);
  expect(foodItems[0].FoodName).toBe("Orange");

  expect(mockFind).toHaveBeenCalledTimes(1);
});
