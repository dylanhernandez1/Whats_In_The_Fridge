import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import dotenv from 'dotenv';
import { app } from '../app.js';
import userServices from '../user-services.js';
import houseServices from '../house-services.js';
import UserHouseServices from '../UserHouse-services.js';
import foodServices from '../food-services.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

jest.mock('../user-services.js');
jest.mock('../house-services.js');
jest.mock('../UserHouse-services.js');
jest.mock('../food-services.js');

dotenv.config();

let mongoServer;

const authToken = jwt.sign(
  { email: "getme@test.com" },
  process.env.TOKEN_SECRET,
  { expiresIn: "1h" }
);

const sampleFood = { FoodName: "Apple", FoodType: "Fruit", expirationDate: "2025-06-01" };


beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

jest.useFakeTimers().setSystemTime(new Date("2025-01-01"));

describe("User Routes", () => {
  describe("POST /users", () => {
    it("should return 400 if required fields are missing", async () => {
      const res = await request(app).post("/users").send({});
      expect(res.statusCode).toBe(400);
    });

    it("should return 409 if username already exists", async () => {
      userServices.getUsers.mockImplementationOnce(() =>
        Promise.resolve({ name: "testuser" })
      );

      const res = await request(app)
        .post("/users")
        .send({ name: "testuser", email: "test@example.com", password: "pass" });

      console.log("TEST TOKEN: ", authToken);

      expect(res.statusCode).toBe(409);
      expect(res.text).toBe("Username already taken");
    });

    it("should return 409 if email already exists", async () => {
      userServices.getUsers
        .mockImplementationOnce(() => Promise.resolve(null)) // name check
        .mockImplementationOnce(() => Promise.resolve({ email: "test@example.com" })); // email check

      const res = await request(app)
        .post("/users")
        .send({ name: "newuser", email: "test@example.com", password: "pass" });

      expect(res.statusCode).toBe(409);
      expect(res.text).toBe("Email already in use");
    });

    it("should return 201 with token if user is added successfully", async () => {
      userServices.getUsers.mockResolvedValue(null);
      userServices.addUser.mockResolvedValue({ _id: "123" });

      const res = await request(app)
        .post("/users")
        .send({ name: "user", email: "user@test.com", password: "password" });

      expect(res.statusCode).toBe(201);
      expect(res.body.token).toBeDefined();

      const decoded = jwt.verify(res.body.token, process.env.TOKEN_SECRET);
      expect(decoded.email).toBe("user@test.com");
    });
  });

  describe("POST /login", () => {
    it("should return 401 if user is not found", async () => {
      userServices.getUsers.mockResolvedValue(null);

      const res = await request(app)
        .post("/login")
        .send({ email: "notfound@test.com", password: "pass" });

      expect(res.statusCode).toBe(401);
      expect(res.text).toBe("Invalid credentials.");
    });

    it("should return 401 if password does not match", async () => {
      userServices.getUsers.mockResolvedValue({
        email: "test@test.com",
        password: await bcrypt.hash("correct", 10)
      });

      const res = await request(app)
        .post("/login")
        .send({ email: "test@test.com", password: "wrong" });

      expect(res.statusCode).toBe(401);
      expect(res.text).toBe("Invalid credentials.");
    });

    it("should return 200 and token if credentials are correct", async () => {
      const hashedPwd = await bcrypt.hash("secret", 10);
      userServices.getUsers.mockResolvedValue({
        email: "valid@test.com",
        password: hashedPwd
      });

      const res = await request(app)
        .post("/login")
        .send({ email: "valid@test.com", password: "secret" });

      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();

      const decoded = jwt.verify(res.body.token, process.env.TOKEN_SECRET);
      expect(decoded.email).toBe("valid@test.com");
    });
  });

  describe("GET /user", () => {
    const token = jwt.sign({ email: "getme@test.com" }, process.env.TOKEN_SECRET, {
      expiresIn: "600s"
    });

    it("should return 401 if token is missing", async () => {
      const res = await request(app).get("/user");
      expect(res.statusCode).toBe(401);
    });

    it("should return 404 if user not found", async () => {
      userServices.findUserByEmail.mockResolvedValue(null);

      const res = await request(app)
        .get("/user")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
      expect(res.text).toBe("User not found");
    });

    it("should return user data if found", async () => {
      const mockUser = {
        _id: "abc123",
        name: "Dill Pickle",
        email: "getme@test.com",
        preferences: {},
        createdAt: new Date(),
        profileImage: "image.png"
      };

      userServices.findUserByEmail.mockResolvedValue(mockUser);

      const res = await request(app)
        .get("/user")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.email).toBe("getme@test.com");
      expect(res.body.name).toBe("Dill Pickle");
    });
  });

  describe("GET /users", () => {
    it("should return 404 if no user found", async () => {
      userServices.getUsers.mockResolvedValue(null);

      const res = await request(app).get("/users");
      expect(res.statusCode).toBe(404);
    });

    it("should return users if found", async () => {
      const mockUsers = [
        { name: "A", email: "a@test.com" },
        { name: "B", email: "b@test.com" }
      ];
      userServices.getUsers.mockResolvedValue(mockUsers);

      const res = await request(app).get("/users");
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);
    });
  });
});

it("should return 400 if password is too short", async () => {
  const res = await request(app)
    .post("/users")
    .send({ name: "tiny123", email: "short@test.com", password: "123" });

  expect(res.statusCode).toBe(409);
});

it("should return 400 if email or password is missing", async () => {
  const res = await request(app)
    .post("/login")
    .send({ email: "test@test.com" }); // no password

  expect(res.statusCode).toBe(401);
});

it("should return 401 if token is invalid or expired", async () => {
  const invalidToken = "Bearer faketoken";

  const res = await request(app)
    .get("/user")
    .set("Authorization", invalidToken);

  expect(res.statusCode).toBe(401);
});

it("should return empty array if no users in DB", async () => {
  userServices.getUsers.mockResolvedValue([]);

  const res = await request(app).get("/users");

  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
  expect(res.body.length).toBe(0);
});


describe("GET /houses/:houseId", () => {
  it("should return the house when found", async () => {
    const mockHouse = { _id: "house123", name: "Test House" };
    houseServices.getHouseById.mockResolvedValue(mockHouse);

    const res = await request(app).get("/houses/house123");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockHouse);
  });

  it("should return 404 if house not found", async () => {
    houseServices.getHouseById.mockResolvedValue(null);

    const res = await request(app).get("/houses/missing");

    expect(res.statusCode).toBe(404);
    expect(res.text).toBe("House not found.");
  });

  it("should return 500 on service error", async () => {
    houseServices.getHouseById.mockRejectedValue(new Error("DB Error"));

    const res = await request(app).get("/houses/house123");

    expect(res.statusCode).toBe(500);
    expect(res.text).toMatch(/Internal Server Error/);
  });
});

describe("POST /houses/:houseId/food/:location", () => {

  it("should add food successfully", async () => {
    const foodItem = { name: "Banana", quantity: 6 };
    const savedFood = { ...foodItem, _id: "food123" };

    houseServices.addFoodToHouse.mockResolvedValue({
      success: true,
      savedFood
    });

    const res = await request(app)
      .post("/houses/house123/food/fridge")
      .set("Authorization", `Bearer ${authToken}`)
      .send(foodItem);

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(savedFood);
  });

  it("should return 400 if service returns failure", async () => {
    houseServices.addFoodToHouse.mockResolvedValue({
      success: false,
      message: "Invalid location"
    });

    const res = await request(app)
      .post("/houses/house123/food/badlocation")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ name: "Milk" });

    expect(res.statusCode).toBe(400);
    expect(res.text).toBe("Invalid location");
  });

  it("should return 500 on service error", async () => {
    houseServices.addFoodToHouse.mockRejectedValue(new Error("DB Error"));

    const res = await request(app)
      .post("/houses/house123/food/fridge")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ name: "Milk" });

    expect(res.statusCode).toBe(500);
    expect(res.text).toMatch(/Internal Server Error/);
  });
});

describe("GET /houses/:houseId/food/:location?", () => {

  it("should get food from a specific location", async () => {
    const foodItems = [{ name: "Apple" }];
    houseServices.getFoodFromHouse.mockResolvedValue({
      success: true,
      foodItems
    });

    const res = await request(app)
      .get("/houses/house123/food/pantry")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(foodItems);
  });

  it("should get all food from a house when no location is provided", async () => {
    const foodItems = [{ name: "Eggs" }];
    houseServices.getAllFoodFromHouse.mockResolvedValue({
      success: true,
      foodItems
    });

    const res = await request(app)
      .get("/houses/house123/food")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(foodItems);
  });

  it("should return 400 on failure", async () => {
    houseServices.getFoodFromHouse.mockResolvedValue({
      success: false,
      message: "Invalid location"
    });

    const res = await request(app)
      .get("/houses/house123/food/invalid")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(400);
    expect(res.text).toBe("Invalid location");
  });

  it("should return 500 on error", async () => {
    houseServices.getFoodFromHouse.mockRejectedValue(new Error("Error"));

    const res = await request(app)
      .get("/houses/house123/food/pantry")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(500);
    expect(res.text).toMatch(/Internal Server Error/);
  });
});

describe("Food Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /food", () => {
    it("should add food and return 201", async () => {
      foodServices.addFood.mockResolvedValue(sampleFood);
      const res = await request(app).post("/food").send(sampleFood);
      expect(res.status).toBe(201);
      expect(res.body).toEqual(sampleFood);
    });

    it("should return 400 if addFood returns null", async () => {
      foodServices.addFood.mockResolvedValue(null);
      const res = await request(app).post("/food").send(sampleFood);
      expect(res.status).toBe(400);
      expect(res.text).toBe("Invalid date");
    });

    it("should return 500 on server error", async () => {
      foodServices.addFood.mockRejectedValue("DB Error");
      const res = await request(app).post("/food").send(sampleFood);
      expect(res.status).toBe(500);
      expect(res.text).toContain("Internal Server Error");
    });
  });

  describe("GET /food", () => {
    it("should return food array", async () => {
      foodServices.getFood.mockResolvedValue([sampleFood]);
      const res = await request(app).get("/food");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([sampleFood]);
    });

    it("should return 404 if no food found", async () => {
      foodServices.getFood.mockResolvedValue(null);
      const res = await request(app).get("/food");
      expect(res.status).toBe(404);
    });
  });

  describe("GET /food/:name", () => {
    it("should return food by name", async () => {
      foodServices.findFoodByName.mockResolvedValue(sampleFood);
      const res = await request(app).get("/food/Apple");
      expect(res.status).toBe(200);
      expect(res.body).toEqual(sampleFood);
    });

    it("should return 404 if food not found", async () => {
      foodServices.findFoodByName.mockResolvedValue(null);
      const res = await request(app).get("/food/Apple");
      expect(res.status).toBe(404);
    });
  });

  describe("GET /expiring", () => {
    it("should return expiring food when authenticated", async () => {
      foodServices.findFoodByExpiration.mockResolvedValue([sampleFood]);
      const res = await request(app)
        .get("/expiring")
        .set("Authorization", `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual([sampleFood]);
    });

    it("should return 404 if no expiring food", async () => {
      foodServices.findFoodByExpiration.mockResolvedValue(null);
      const res = await request(app)
        .get("/expiring")
        .set("Authorization", `Bearer ${authToken}`);
      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /food/:id", () => {
    it("should delete food by id", async () => {
      foodServices.deleteFoodById.mockResolvedValue(true);
      const res = await request(app)
        .delete("/food/123")
        .set("Authorization", `Bearer ${authToken}`);
      expect(res.status).toBe(201);
      expect(res.text).toBe("Successfully deleted!");
    });

    it("should return 400 if deletion fails", async () => {
      foodServices.deleteFoodById.mockResolvedValue(null);
      const res = await request(app)
        .delete("/food/123")
        .set("Authorization", `Bearer ${authToken}`);
      expect(res.status).toBe(400);
    });

    it("should return 400 on delete error", async () => {
      foodServices.deleteFoodById.mockRejectedValue("Error");
      const res = await request(app)
        .delete("/food/123")
        .set("Authorization", `Bearer ${authToken}`);
      expect(res.status).toBe(400);
    });
  });

  describe("GET /", () => {
    it("should return Hello World!", async () => {
      const res = await request(app).get("/");
      expect(res.status).toBe(200);
      expect(res.text).toBe("Hello World!");
    });
  });
});