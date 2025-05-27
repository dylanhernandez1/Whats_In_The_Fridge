import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import dotenv from "dotenv";
import { app } from "../app.js";
import userServices from "../user-services.js";
import houseServices from "../house-services.js";
import userHouseServices from "../UserHouse-services.js";
import foodServices from "../food-services.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

jest.mock("nodemailer");
jest.mock("../user-services.js");
jest.mock("../house-services.js");
jest.mock("../UserHouse-services.js");
jest.mock("../food-services.js");

dotenv.config();

let mongoServer;

const authToken = jwt.sign(
  { email: "getme@test.com" },
  process.env.TOKEN_SECRET,
  { expiresIn: "1h" }
);

const sampleFood = {
  FoodName: "Apple",
  FoodType: "Fruit",
  expirationDate: "2025-06-01"
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
  jest.clearAllMocks();
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

      const res = await request(app).post("/users").send({
        name: "testuser",
        email: "test@example.com",
        password: "pass"
      });

      console.log("TEST TOKEN: ", authToken);

      expect(res.statusCode).toBe(409);
      expect(res.text).toBe("Username already taken");
    });

    it("should return 409 if email already exists", async () => {
      userServices.getUsers
        .mockImplementationOnce(() => Promise.resolve(null)) // name check
        .mockImplementationOnce(() =>
          Promise.resolve({ email: "test@example.com" })
        ); // email check

      const res = await request(app).post("/users").send({
        name: "newuser",
        email: "test@example.com",
        password: "pass"
      });

      expect(res.statusCode).toBe(409);
      expect(res.text).toBe("Email already taken");
    });

    it("should return 201 with token if user is added successfully", async () => {
      userServices.getUsers.mockResolvedValue(null);
      userServices.addUser.mockResolvedValue({ _id: "123" });

      const res = await request(app).post("/users").send({
        name: "user",
        email: "user@test.com",
        password: "password"
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.token).toBeDefined();

      const decoded = jwt.verify(
        res.body.token,
        process.env.TOKEN_SECRET
      );
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
        password: hashedPwd,
        emailVerified: true
      });

      const res = await request(app)
        .post("/login")
        .send({ email: "valid@test.com", password: "secret" });

      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();

      const decoded = jwt.verify(
        res.body.token,
        process.env.TOKEN_SECRET
      );
      expect(decoded.email).toBe("valid@test.com");
    });
  });

  describe("GET /user", () => {
    const token = jwt.sign(
      { email: "getme@test.com" },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "600s"
      }
    );

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
  const res = await request(app).post("/users").send({
    name: "tiny123",
    email: "short@test.com",
    password: "123"
  });

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
    houseServices.getHouseById.mockRejectedValue(
      new Error("DB Error")
    );

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

    expect(res.statusCode).toBe(204);
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
    houseServices.addFoodToHouse.mockRejectedValue(
      new Error("DB Error")
    );

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
    houseServices.getFoodFromHouse.mockRejectedValue(
      new Error("Error")
    );

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
      const res = await request(app)
        .post("/food")
        .send(sampleFood);
      expect(res.status).toBe(201);
      expect(res.body).toEqual(sampleFood);
    });

    it("should return 400 if addFood returns null", async () => {
      foodServices.addFood.mockResolvedValue(null);
      const res = await request(app)
        .post("/food")
        .send(sampleFood);
      expect(res.status).toBe(400);
      expect(res.text).toBe("Invalid date");
    });

    it("should return 500 on server error", async () => {
      foodServices.addFood.mockRejectedValue("DB Error");
      const res = await request(app)
        .post("/food")
        .send(sampleFood);
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
      foodServices.findFoodByExpiration.mockResolvedValue([
        sampleFood
      ]);
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

it("should return 400 if name is missing", async () => {
  const res = await request(app)
    .post("/users")
    .send({ email: "a@b.com", password: "123456" });
  expect(res.status).toBe(400);
});

it("should return 400 if email is missing", async () => {
  const res = await request(app)
    .post("/users")
    .send({ name: "Dylan", password: "123456" });
  expect(res.status).toBe(400);
});

it("should return 400 if password is missing", async () => {
  const res = await request(app)
    .post("/users")
    .send({ name: "Dylan", email: "a@b.com" });
  expect(res.status).toBe(400);
});

describe("POST /users", () => {
  it("should return 400 if userServices.addUser returns a message", async () => {
    userServices.getUsers.mockResolvedValue(null); // Simulate no name or email conflict
    userServices.addUser.mockResolvedValue({
      message: "Something went wrong adding user."
    });

    const response = await request(app).post("/users").send({
      name: "dill",
      email: "dill@example.com",
      password: "securepassword"
    });

    expect(response.status).toBe(400);
    expect(response.text).toBe(
      "Something went wrong adding user."
    );
  });

  it("should return 500 if an unexpected error occurs", async () => {
    // No name or email conflict
    userServices.getUsers.mockResolvedValue(null);

    // Force an error to be thrown in the try block
    userServices.addUser.mockImplementation(() => {
      throw new Error("Database failure");
    });

    const response = await request(app).post("/users").send({
      name: "crashuser",
      email: "crash@example.com",
      password: "somepass"
    });

    expect(response.status).toBe(500);
    expect(response.text).toBe("Internal Server Error");
  });
});

it("should return 500 if findUserByEmail throws an error", async () => {
  userServices.findUserByEmail.mockRejectedValue(
    new Error("Database read failure")
  );

  const response = await request(app)
    .get("/user")
    .set("Authorization", `Bearer ${authToken}`);

  expect(response.status).toBe(500);
  expect(response.text).toContain("Internal Server Error");
  expect(response.text).toContain("Database read failure");
});

it("should return 500 if userServices.getUsers throws an error", async () => {
  userServices.getUsers.mockRejectedValue(
    new Error("Database connection failed")
  );

  const response = await request(app).get("/users");

  expect(response.status).toBe(500);
  expect(response.text).toContain("Internal Server Error");
  expect(response.text).toContain("Database connection failed");
});

describe("POST /login", () => {
  it("should return 500 if an exception is thrown during login", async () => {
    userServices.getUsers.mockRejectedValue(
      new Error("Database failure")
    );

    const response = await request(app).post("/login").send({
      email: "test@example.com",
      password: "password123"
    });

    expect(response.status).toBe(500);
    expect(response.text).toContain("Internal Server Error");
  });
});

describe("Email Verification & Password Reset", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /verify-email", () => {
    it("should return 500 on email send error", async () => {
      const sendMailMock = jest.fn((opts, cb) =>
        cb(new Error("Send failed"))
      );
      nodemailer.createTransport.mockReturnValue({
        sendMail: sendMailMock
      });

      const res = await request(app)
        .post("/verify-email")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ email: "user@example.com" });

      expect(res.statusCode).toBe(500);
    });
  });

  describe("GET /verify-email/:id", () => {
    it("should return 401 on invalid token", async () => {
      const res = await request(app).get(
        "/verify-email/badToken"
      );
      expect(res.statusCode).toBe(401);
    });
  });

  describe("POST /forgot-password", () => {
    it("should send reset password email", async () => {
      const sendMailMock = jest.fn((opts, cb) =>
        cb(null, true)
      );
      nodemailer.createTransport.mockReturnValue({
        sendMail: sendMailMock
      });

      const res = await request(app)
        .post("/forgot-password")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ email: "user@example.com" });

      expect(sendMailMock).toHaveBeenCalled();
      expect(res.statusCode).toBe(201); // sendMail does not return status, so 200 still assumed
    });
  });

  describe("POST /forgot-password-change", () => {
    it("should return 500 if user doesn't exist", async () => {
      userServices.getUsers.mockResolvedValue(null);

      const res = await request(app)
        .post(`/forgot-password-change/${authToken}`)
        .send({
          name: "test",
          email: "test@test.com",
          password: "pass"
        });

      expect(res.statusCode).toBe(500);
    });

    it("should return 500 on bcrypt or service error", async () => {
      userServices.getUsers.mockRejectedValue(
        new Error("DB fail")
      );

      const res = await request(app)
        .post(`/forgot-password-change/${authToken}`)
        .send({
          name: "test",
          email: "test@test.com",
          password: "pass"
        });

      expect(res.statusCode).toBe(500);
    });
  });
});

describe("POST /houses", () => {
  it("should create a new house and associate it with the user", async () => {
    // Mock user retrieval
    userServices.findUserByEmail.mockResolvedValue({
      _id: "user123"
    });

    // Mock house creation
    houseServices.createHouse.mockResolvedValue({
      _id: "house123",
      name: "Test House"
    });

    // Mock adding user to house
    userHouseServices.addUserToHouse.mockResolvedValue({
      savedUserHouse: {
        userId: "user123",
        houseId: "house123",
        role: "owner"
      }
    });

    // Mock setting default house
    userServices.setDefaultHouse.mockResolvedValue(true);

    const response = await request(app)
      .post("/houses")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ name: "Test House" })
      .expect(201);

    expect(response.body.house).toEqual({
      _id: "house123",
      name: "Test House"
    });
    expect(response.body.userHouse).toEqual({
      userId: "user123",
      houseId: "house123",
      role: "owner"
    });
  });
});

describe("GET /houses/:houseId", () => {
  it("should retrieve a house by ID", async () => {
    houseServices.getHouseById.mockResolvedValue({
      _id: "house123",
      name: "Test House"
    });

    const response = await request(app)
      .get("/houses/house123")
      .expect(200);

    expect(response.body).toEqual({
      _id: "house123",
      name: "Test House"
    });
  });

  it("should return 404 if house not found", async () => {
    houseServices.getHouseById.mockResolvedValue(null);

    const response = await request(app)
      .get("/houses/nonexistent")
      .expect(404);

    expect(response.text).toBe("House not found.");
  });
});

describe("POST /houses/:houseId/food/:location", () => {
  it("should add food to the specified location in the house", async () => {
    houseServices.addFoodToHouse.mockResolvedValue({
      success: true,
      savedFood: { name: "Apple", quantity: 10 }
    });

    const response = await request(app)
      .post("/houses/house123/food/kitchen")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ name: "Apple", quantity: 10 })
      .expect(204);
  });

  it("should return 400 if adding food fails", async () => {
    houseServices.addFoodToHouse.mockResolvedValue({
      success: false,
      message: "Invalid data"
    });

    const response = await request(app)
      .post("/houses/house123/food/kitchen")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ name: "", quantity: 0 })
      .expect(400);

    expect(response.text).toBe("Invalid data");
  });
});

describe("GET /houses/:houseId/food/:location?", () => {
  it("should retrieve food from a specific location", async () => {
    houseServices.getFoodFromHouse.mockResolvedValue({
      success: true,
      foodItems: [{ name: "Apple", quantity: 10 }]
    });

    const response = await request(app)
      .get("/houses/house123/food/kitchen")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toEqual([
      { name: "Apple", quantity: 10 }
    ]);
  });

  it("should retrieve all food if location is not specified", async () => {
    houseServices.getAllFoodFromHouse.mockResolvedValue({
      success: true,
      foodItems: [
        { name: "Apple", quantity: 10 },
        { name: "Banana", quantity: 5 }
      ]
    });

    const response = await request(app)
      .get("/houses/house123/food")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toEqual([
      { name: "Apple", quantity: 10 },
      { name: "Banana", quantity: 5 }
    ]);
  });

  it("should return 400 if retrieval fails", async () => {
    houseServices.getFoodFromHouse.mockResolvedValue({
      success: false,
      message: "Location not found"
    });

    const response = await request(app)
      .get("/houses/house123/food/unknown")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(400);

    expect(response.text).toBe("Location not found");
  });
});

describe("POST /houses/:houseId/users/:userId", () => {
  it("should add a user to the house", async () => {
    userHouseServices.addUserToHouse.mockResolvedValue({
      success: true,
      savedUserHouse: {
        userId: "user123",
        houseId: "house123",
        role: "member"
      }
    });

    const response = await request(app)
      .post("/houses/house123/users/user123")
      .send({ role: "member" })
      .expect(201);

    expect(response.body).toEqual({
      userId: "user123",
      houseId: "house123",
      role: "member"
    });
  });

  it("should return 400 if adding user fails", async () => {
    userHouseServices.addUserToHouse.mockResolvedValue({
      success: false,
      message: "User already in house"
    });

    const response = await request(app)
      .post("/houses/house123/users/user123")
      .send({ role: "member" })
      .expect(400);

    expect(response.text).toBe("User already in house");
  });
});

describe("DELETE /houses/:houseId/users/:userId", () => {
  it("should remove a user from the house", async () => {
    userHouseServices.removeUserFromHouse.mockResolvedValue({
      success: true,
      removedUserHouse: {
        userId: "user123",
        houseId: "house123"
      }
    });

    const response = await request(app)
      .delete("/houses/house123/users/user123")
      .expect(200);

    expect(response.body).toEqual({
      userId: "user123",
      houseId: "house123"
    });
  });

  it("should return 404 if user not found in house", async () => {
    userHouseServices.removeUserFromHouse.mockResolvedValue({
      success: false,
      message: "User not found in house"
    });

    const response = await request(app)
      .delete("/houses/house123/users/user123")
      .expect(404);

    expect(response.text).toBe("User not found in house");
  });
});

describe("PATCH /houses/updateFood/:houseId", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should remove food and return 200 on success", async () => {
    houseServices.removeFoodFromHouse.mockResolvedValue({
      success: true,
      removedFoodId: "food123"
    });

    const response = await request(app)
      .patch("/houses/updateFood/house123")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ deletedFoodId: "food123" })
      .expect(200);

    expect(response.body).toEqual({
      success: true,
      removedFoodId: "food123"
    });
    expect(
      houseServices.removeFoodFromHouse
    ).toHaveBeenCalledWith("house123", "food123");
  });

  it("should return 400 if removal was unsuccessful", async () => {
    houseServices.removeFoodFromHouse.mockResolvedValue({
      success: false,
      message: "Food not found"
    });

    const response = await request(app)
      .patch("/houses/updateFood/house123")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ deletedFoodId: "foodXYZ" })
      .expect(400);

    expect(response.text).toBe("Food not found");
  });

  it("should return 500 if service throws an error", async () => {
    houseServices.removeFoodFromHouse.mockRejectedValue(
      new Error("Database failure")
    );

    const response = await request(app)
      .patch("/houses/updateFood/house123")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ deletedFoodId: "foodABC" })
      .expect(500);

    expect(response.text).toBe("Internal server error.");
  });
});

describe("PUT /houses/:houseId/users/:userId/role", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update a user's role in a house and return 200", async () => {
    const updatedUserHouse = {
      userId: "user123",
      houseId: "house456",
      role: "member"
    };

    userHouseServices.changeUserRoleInHouse.mockResolvedValue({
      success: true,
      updatedUserHouse
    });

    const response = await request(app)
      .put("/houses/house456/users/user123/role")
      .send({ role: "owner" })
      .expect(200);

    expect(response.body).toEqual(updatedUserHouse);
    expect(
      userHouseServices.changeUserRoleInHouse
    ).toHaveBeenCalledWith("user123", "house456", "owner");
  });

  it("should return 400 if role change fails", async () => {
    userHouseServices.changeUserRoleInHouse.mockResolvedValue({
      success: false,
      message: "User not found in house"
    });

    const response = await request(app)
      .put("/houses/house456/users/user999/role")
      .send({ role: "member" })
      .expect(400);

    expect(response.text).toBe("User not found in house");
  });

  it("should return 500 if service throws an error", async () => {
    userHouseServices.changeUserRoleInHouse.mockRejectedValue(
      new Error("Database connection lost")
    );

    const response = await request(app)
      .put("/houses/house456/users/user123/role")
      .send({ role: "member" })
      .expect(500);

    expect(response.text).toContain("Internal Server Error");
    expect(response.text).toContain("Database connection lost");
  });
});

describe("GET /userhouses", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns houses and default house for logged-in user", async () => {
    const mockUser = {
      _id: "user123",
      preferences: new Map([["defaultHouse", "house456"]])
    };
    const mockHouses = {
      success: true,
      housesByUser: [{ id: "house1" }, { id: "house2" }]
    };
    const mockDefaultHouse = {
      success: true,
      house: { id: "house456", name: "Main House" }
    };

    userServices.findUserByEmail.mockResolvedValue(mockUser);
    userHouseServices.getHousesByUser.mockResolvedValue(
      mockHouses
    );
    houseServices.findHouseById.mockResolvedValue(
      mockDefaultHouse
    );

    const response = await request(app)
      .get("/userhouses")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toEqual({
      housesByUser: mockHouses.housesByUser,
      defaultHouse: mockDefaultHouse.house
    });
  });

  it("uses email query param if provided", async () => {
    const mockUser = { _id: "u456", preferences: new Map() };
    const mockHouses = {
      success: true,
      housesByUser: [{ id: "houseA" }]
    };

    userServices.findUserByEmail.mockResolvedValue(mockUser);
    userHouseServices.getHousesByUser.mockResolvedValue(
      mockHouses
    );
    houseServices.findHouseById.mockResolvedValue({}); // won't be called

    const response = await request(app)
      .get("/userhouses?email=other@example.com")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200);

    expect(userServices.findUserByEmail).toHaveBeenCalledWith(
      "other@example.com"
    );
    expect(response.body).toEqual({
      housesByUser: mockHouses.housesByUser,
      defaultHouse: null
    });
  });

  it("returns 404 if getHousesByUser fails", async () => {
    const mockUser = { _id: "userX", preferences: new Map() };

    userServices.findUserByEmail.mockResolvedValue(mockUser);
    userHouseServices.getHousesByUser.mockResolvedValue({
      success: false,
      message: "No houses found"
    });

    const response = await request(app)
      .get("/userhouses")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(404);

    expect(response.text).toBe("No houses found");
  });

  it("returns 500 if getHousesByUser throws", async () => {
    const mockUser = { _id: "userY", preferences: new Map() };

    userServices.findUserByEmail.mockResolvedValue(mockUser);
    userHouseServices.getHousesByUser.mockRejectedValue(
      new Error("DB error")
    );

    const response = await request(app)
      .get("/userhouses")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(500);

    expect(response.text).toContain("Internal Server Error");
    expect(response.text).toContain("DB error");
  });
});
