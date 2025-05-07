import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import mongoose from "mongoose";
import dotenv from "dotenv";

import userServices from "./user-services.js";
import foodServices from "./food-services.js";
import houseServices from "./house-services.js";
import userHouseServices from "./UserHouse-services.js";
import { GiConsoleController } from "react-icons/gi";
import nodemailer from "nodemailer";

dotenv.config(); //Load dotenv
mongoose.set("debug", true);

//Initialize app and users list
const app = express();
const port = 8000;

//For Cross-Origin Resource Sharing and json
app.use(
  cors({
    origin: [
      "https://white-stone-02cbbab1e.6.azurestaticapps.net",
      "http://localhost:5173"
    ], // CHANGE TO FRONTEND URL WHEN RECEIVED
    credentials: true
  })
);

app.use(express.json());

app.options("*", cors());

//Connect to database
mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1); //Exit the app if the database connection fails
  });

/* -------------------- USERS -------------------- */
function generateAccessToken(email) {
  return jwt.sign({ email: email }, process.env.TOKEN_SECRET, {
    expiresIn: "600s"
  });
}

function authenticateUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  //Getting the 2nd part of the auth hearder (the token)
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log("No token received");
    return res.status(401).end();
  } else {
    // If a callback is supplied, verify() runs async
    // If a callback isn't supplied, verify() runs synchronously
    // verify() throws an error if the token is invalid
    try {
      // verify() returns the decoded obj which includes whatever objs
      // we use to code/sign the token
      const decoded = jwt.verify(
        token,
        process.env.TOKEN_SECRET
      );
      // in our case, we used the email to sign the token
      console.log("Decoded token: ", decoded);
      req.userEmail = decoded.email;
      next();
    } catch (error) {
      //console.log(error);
      return res.status(401).end();
    }
  }
}

//Add a user
app.post("/users", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !password || !email) {
    res.status(400).send("Bad request: Invalid input data.");
  }
  try {
    const existingName = await userServices.getUsers({ name });
    if (existingName) {
      return res.status(409).send("Username already taken");
    }

    const existingEmail = await userServices.getUsers({
      email
    });
    if (existingEmail) {
      return res.status(409).send("Email already taken");
    }
    //HASH PASSWORD
    const saltRounds = 10;
    const hashedPwd = await bcrypt.hash(password, saltRounds);

    const userToAdd = { name, email, password: hashedPwd };
    const result = await userServices.addUser(userToAdd);

    if (result.message) {
      return res.status(400).send(result.message);
    }
    const token = generateAccessToken(email);
    console.log("JWT: ", token);
    res.status(201).send({ token });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).send("Internal Server Error");
  }
});

//Get users or specific users with query
app.get("/users", (req, res) => {
  userServices
    .getUsers(req.query)
    .then((result) => {
      if (!result)
        return res.status(404).send("Resource not found.");
      res.send(result);
    })
    .catch((error) =>
      res.status(500).send(`Internal Server Error: ${error}`)
    );
});

/* -------------------- LOGIN -------------------- */
//Validate login info
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const retrievedUser = await userServices.getUsers({
      email
    });

    if (
      !retrievedUser ||
      !retrievedUser.email ||
      !retrievedUser.password
    ) {
      // User not found/invalid format
      return res.status(401).send("Invalid credentials.");
    }

    const isValid = await bcrypt.compare(
      password,
      retrievedUser.password
    );

    if (!isValid) {
      // Incorrect password
      return res.status(401).send("Invalid credentials.");
    }

    // Successfully authenticated, generate and send token
    const token = generateAccessToken(email);
    return res.status(200).send({ token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

/* -------------------- EMAIL-VERIFICATION -------------------- */

function generateVerificationToken(email) {
  return jwt.sign({ email: email }, process.env.TOKEN_SECRET, {
    expiresIn: "600s"
  });
}

app.post("/verify-email", async (req, res) => {
  const email = req.body;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "whatsinthefridgee@gmail.com",
      pass: "sakxwwftzytcliwy"
    }
  });

  const token = generateVerificationToken(email);
  console.log("JWT: ", token);

  const mailOptions = {
    from: "no-reply@whats-in-the-fridge.com <donotreply@whatsinthefridge@gmail.com>",
    to: email.email,
    subject: "Whats In The Fridge Email Verification",
    text: `Hello, ${email.name}. Please verify your email by clicking this link : http://localhost:5173/verify-email/:${token}`
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("Error", err);
      return res.status(500).json(err);
    } else {
      console.log("Email sent");
      return res.status(200);
    }
  });
});

app.get("/verify-email/:id", async (req, res) => {
  console.log("help");
});

/* -------------------- HOUSES -------------------- */
//Add a house
app.post("/houses", authenticateUser, async (req, res) => {
  try {
    const user = await userServices.findUserByEmail(
      req.userEmail
    );
    if (!user) {
      return res.status(404).send("User not found");
    }

    const houseData = {
      ...req.body,
      createdBy: user._id
    };

    // Save House
    const house = await houseServices.createHouse(houseData);

    const userHouse = new UserHouse({
      user: user._id,
      house: house._id,
      role: "owner"
    });

    // Save UserHouse
    await userHouse.save();

    // Set default house
    user.preferences.defaultHouse = house._id;
    await user.save();

    // Success
    res.status(201).send({
      house,
      userHouse
    });
  } catch (error) {
    console.error("Error creating house:", error);
    res.status(500).send(`Internal Server Error: ${error}`);
  }
});

//Get a certain house by id
app.get("/houses/:houseId", (req, res) => {
  const houseId = req.params.houseId;

  houseServices
    .getHouseById(houseId)
    .then((house) => {
      if (house) {
        res.send(house);
      } else {
        res.status(404).send("House not found.");
      }
    })
    .catch((error) => {
      res.status(500).send(`Internal Server Error: ${error}`);
    });
});

//Add food to certain location in house
app.post(
  "/houses/:houseId/food/:location",
  authenticateUser,
  async (req, res) => {
    const houseId = req.params.houseId;
    const location = req.params.location;
    const foodItem = req.body;

    houseServices
      .addFoodToHouse(houseId, location, foodItem)
      .then((result) => {
        if (result.success) {
          res.status(201).send(result.savedFood);
        } else {
          res.status(400).send(result.message);
        }
      })
      .catch((error) => {
        res.status(500).send(`Internal Server Error: ${error}`);
      });
  }
);

//Get all food items from a specific location in a house
app.get(
  "/houses/:houseId/food/:location?",
  authenticateUser,
  async (req, res) => {
    const { houseId, location } = req.params;

    const service = location
      ? houseServices.getFoodFromHouse(houseId, location)
      : houseServices.getAllFoodFromHouse(houseId);

    service
      .then((result) => {
        if (result.success) {
          res.send(result.foodItems);
        } else {
          res.status(400).send(result.message);
        }
      })
      .catch((error) => {
        res.status(500).send(`Internal Server Error: ${error}`);
      });
  }
);

/* -------------------- USER-HOUSE -------------------- */
//Add user to house
app.post("/houses/:houseId/users/:userId", (req, res) => {
  const { houseId, userId } = req.params;
  const role = req.body.role || "member"; //If given role, otherwise member
  userHouseServices
    .addUserToHouse(userId, houseId, role)
    .then((result) => {
      if (!result.success)
        return res.status(400).send(result.message);
      res.status(201).send(result.savedUserHouse);
    })
    .catch((error) =>
      res.status(500).send(`Internal Server Error: ${error}`)
    );
});

//Remove user from house
app.delete("/houses/:houseId/users/:userId", (req, res) => {
  const { houseId, userId } = req.params;
  userHouseServices
    .removeUserFromHouse(userId, houseId)
    .then((result) => {
      if (!result.success)
        return res.status(404).send(result.message);
      res.send(result.removedUserHouse);
    })
    .catch((error) =>
      res.status(500).send(`Internal Server Error: ${error}`)
    );
});

//Update a user's role in house
app.put("/houses/:houseId/users/:userId/role", (req, res) => {
  const { houseId, userId } = req.params;
  const { role } = req.body;
  userHouseServices
    .changeUserRoleInHouse(userId, houseId, role)
    .then((result) => {
      if (!result.success)
        return res.status(400).send(result.message);
      res.send(result.updatedUserHouse);
    })
    .catch((error) =>
      res.status(500).send(`Internal Server Error: ${error}`)
    );
});

//Get users in house
app.get("/houses/:houseId/users", (req, res) => {
  const { houseId } = req.params;
  userHouseServices
    .getUsersInHouse(houseId)
    .then((result) => {
      if (!result.success)
        return res.status(404).send(result.message);
      res.send(result.usersInHouse);
    })
    .catch((error) =>
      res.status(500).send(`Internal Server Error: ${error}`)
    );
});

//Get houses a user is a part of
app.get("/userhouses", authenticateUser, async (req, res) => {
  const user = await userServices.findUserByEmail(
    req.userEmail
  ); //Got userEmail from authentication
  userHouseServices
    .getHousesByUser(user._id)
    .then((result) => {
      if (!result.success)
        return res.status(404).send(result.message);

      // Send both default house (if present) and all houses
      res.send({
        housesByUser: result.housesByUser,
        defaultHouse: user.preferences?.defaultHouse ?? null
      });
    })
    .catch((error) =>
      res.status(500).send(`Internal Server Error: ${error}`)
    );
});

/* -------------------- FOOD -------------------- */
function validateRes(res) {
  return res !== undefined && res !== null;
}

//Add food
app.post("/food", (req, res) => {
  const foodToAdd = req.body;
  foodServices
    .addFood(foodToAdd)
    .then((result) => {
      if (result) res.status(201).send(result);
      else res.status(400).send("Invalid date");
    })
    .catch((error) =>
      res.status(500).send(`Internal Server Error: ${error}`)
    );
});

//Get all food
app.get("/food", (req, res) => {
  foodServices
    .getFood()
    .then((mongoRes) => {
      if (validateRes(mongoRes)) res.send(mongoRes);
      else res.status(404).send("Resource not found");
    })
    .catch((error) =>
      res.status(500).send(`Internal Server Error: ${error}`)
    );
});

//Get food by name
app.get("/food/:name", (req, res) => {
  const foodName = req.params.name;
  foodServices
    .findFoodByName(foodName)
    .then((mongoRes) => {
      if (validateRes(mongoRes)) res.send(mongoRes);
      else res.status(404).send("Resource not found");
    })
    .catch((error) =>
      res.status(500).send(`Internal Server Error: ${error}`)
    );
});

//Get expiring food
app.get("/expiring", authenticateUser, async (req, res) => {
  foodServices
    .findFoodByExpiration()
    .then((mongoRes) => {
      if (validateRes(mongoRes)) res.send(mongoRes);
      else res.status(404).send("Resource not found");
    })
    .catch((error) =>
      res.status(500).send(`Internal Server Error: ${error}`)
    );
});

app.delete("/food", (req, res) => {
  const foodId = req.body._id;
  console.log(`The foodId is: ${foodId}`);
  foodServices
    .deleteFoodById(foodId)
    .then((mongoRes) => {
      if (validateRes(mongoRes)) {
        res.status(201).send("Successfully deleted!");
      } else {
        res
          .status(400)
          .send("There was an error deleting the food item");
      }
    })
    .catch((error) =>
      res
        .status(400)
        .send("There was an error deleting the food item")
    );
});

/* -------------------- ROOT -------------------- */
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT || port, () => {
  console.log("REST API is listening.");
});
