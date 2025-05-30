import express, { text } from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";

import userServices from "./user-services.js";
import foodServices from "./food-services.js";
import houseServices from "./house-services.js";
import userHouseServices from "./UserHouse-services.js";
import { GiConsoleController } from "react-icons/gi";
import { createApi } from "unsplash-js";
import nodemailer from "nodemailer";

dotenv.config(); //Load dotenv

//Initialize app and users list
const app = express();

// Move api key to .env folder after
const unsplashApi = createApi({
  accessKey: process.env.UNSPLASH_API_KEY
});

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
    return res
      .status(400)
      .send("Bad request: Invalid input data.");
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
    console.log("Error adding user:", error);
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

//Get certain user that is logged in
app.get("/user", authenticateUser, async (req, res) => {
  try {
    const user = await userServices.findUserByEmail(
      req.userEmail
    );
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Only return safe fields
    return res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      preferences: user.preferences,
      createdAt: user.createdAt,
      profileImage: user.profileImage
    });
  } catch (error) {
    console.log("Error getting user:", error);
    res
      .status(500)
      .send(`Internal Server Error: ${error.message}`);
  }
});

app.delete("/users", async (req, res) => {
  const { email, id } = req.query;

  try {
    let deletedUser = null;

    if (id) {
      deletedUser = await userServices.deleteUserById(id);
    } else if (email) {
      deletedUser = await userServices.deleteUserByEmail(email);
    } else {
      return res
        .status(400)
        .send("Missing 'email' or 'id' in query.");
    }

    if (!deletedUser) {
      return res.status(404).send("User not found.");
    }

    res.send({
      message: "User deleted successfully",
      user: deletedUser
    });
  } catch (error) {
    console.log("Error deleting user:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Delete the currently authenticated user
app.delete(
  "/currentUser",
  authenticateUser,
  async (req, res) => {
    try {
      const user = await userServices.findUserByEmail(
        req.userEmail
      );

      if (!user) {
        return res.status(404).send("User not found");
      }

      //Delete houses
      console.log("USER ID:", user._id);
      await userHouseServices.deleteUserHouses({
        user: user._id
      });

      const deletedUser = await userServices.deleteUserByEmail(
        req.userEmail
      );

      if (deletedUser) {
        return res.status(200).json({
          message: "User account successfully deleted",
          user: deletedUser
        });
      } else {
        return res.status(500).send("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      res
        .status(500)
        .send(`Internal Server Error: ${error.message}`);
    }
  }
);

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

    if (!retrievedUser.emailVerified) {
      return res.status(403).send("Email not verified.");
    }

    // Successfully authenticated, generate and send token
    const token = generateAccessToken(email);
    return res.status(200).send({ token });
  } catch (error) {
    console.log("Login Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

/* -------------------- EMAIL-VERIFICATION -------------------- */

function generateVerificationToken(email) {
  return jwt.sign({ email: email }, process.env.TOKEN_SECRET, {
    expiresIn: "600s"
  });
}

function sendMail(req, res, subject, link) {
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
    subject: subject,
    text: `Hello. 

Please verify your email with this link : 
${link}${token}`
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
}

app.post("/verify-email", async (req, res) => {
  const subject = "What's In The Fridge Email Verification";
  const link =
    "https://white-stone-02cbbab1e.6.azurestaticapps.net/verify-email/";
  sendMail(req, res, subject, link);
});

app.get("/verify-email/:id", async (req, res) => {
  console.log(req);
  try {
    const decoded = jwt.verify(
      req.params.id,
      process.env.TOKEN_SECRET
    );

    //WE VERIFY EMAIL HERE WITH A NON EXPIRED TOKEN
    req.userEmail = decoded.email;
    const user = userServices.findUserByEmail(
      req.userEmail.email
    );
    user.emailVerified = true;
    await user.save();
    return res.status(200).send();
  } catch (error) {
    console.log(error);
    return res.status(401).end();
  }
});

/* -------------------- IMAGE FETCH -------------------- */

async function generateImages(foodName) {
  // User hasn't been prompted to select the food item, so fetch images using the unsplash Api
  console.log("Attempting fetch");
  const promise = unsplashApi.photos.getRandom({
    query: foodName,
    count: 30
  });
  return promise;
}

/* -------------------- FORGOT-PASSWORD -------------------- */

app.post("/forgot-password", async (req, res) => {
  const subject = "What's In The Fridge Password Reset";
  const link =
    "https://white-stone-02cbbab1e.6.azurestaticapps.net/forgot-password-change/";
  try {
    sendMail(req, res, subject, link);

    return res.status(201).send();
  } catch (error) {
    console.log(error);
    return res.status(401).end();
  }
});

//SUBJECT TO CHANGE THIS PART NEEDS TO HAVE THE EMAIL OF THE USER BE SENT
//FROM WHEN CREATING THE EMAIL SO STORE THAT AND SEND THAT WHEN DOING
//THE PASSWORD CHANGE REQUEST

app.post("/forgot-password-change/:token", async (req, res) => {
  const decoded = jwt.verify(
    req.params.token,
    process.env.TOKEN_SECRET
  );
  const email = decoded.email.email;
  const { password } = req.body;
  try {
    const existingEmail =
      await userServices.findUserByEmail(email);
    if (existingEmail) {
      const saltRounds = 10;
      const hashedPwd = await bcrypt.hash(password, saltRounds);

      existingEmail.password = hashedPwd;
      await existingEmail.save();

      const token = generateAccessToken(email);
      res.status(201).send({ token });
    } else {
      console.log(
        "Error: user not found when trying to change"
      );
      res.status(404).send("Internal Server Error");
    }
    //HASH PASSWORD
  } catch (error) {
    console.log("Error changing password error:", error);
    res.status(500).send("Internal Server Error");
  }
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

    let userHouse = await userHouseServices.addUserToHouse(
      user._id,
      house._id,
      "owner"
    );
    userHouse = userHouse.savedUserHouse;

    // Set default house
    await userServices.setDefaultHouse(user, house._id);

    // Success
    res.status(201).send({
      house,
      userHouse
    });
  } catch (error) {
    console.log("Error creating house:", error);
    res.status(500).send(`Internal Server Error: ${error}`);
  }
});

app.delete("/houses/:id", async (req, res) => {
  const houseId = req.params.id;

  const deletedHouse =
    await houseServices.deleteHouseById(houseId);

  if (!deletedHouse) {
    return res.status(404).json({ message: "House not found" });
  }

  return res.status(200).json({
    message: "House deleted successfully",
    house: deletedHouse
  });
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

async function addFoodToHouse(req, res) {
  console.log("Adding food to the database");
  const houseId = req.params.houseId;
  const location = req.params.location;
  const foodItem = req.body;

  houseServices
    .addFoodToHouse(houseId, location, foodItem)
    .then((result) => {
      if (result.success) {
        res.status(204).send();
      } else {
        res.status(400).send(result.message);
      }
    })
    .catch((error) => {
      res.status(500).send(`Internal Server Error: ${error}`);
    });
}

//Add food to certain location in house
app.post(
  "/houses/:houseId/food/:location",
  authenticateUser,
  async (req, res) => {
    const foodImage = req.body.FoodImage;
    if (foodImage !== undefined) {
      addFoodToHouse(req, res);
    } else {
      const foodName = req.body.FoodName;
      console.log(`Generating images for ${foodName}`);
      generateImages(foodName)
        .then((result) => {
          // Some error with retrieving photos, so save the food item to the database instead (with no image)
          if (result.errors) {
            console.log(
              `Unsplash API error: ${result.errors[0]}`
            );
            // Empty string refers to any food item that doesn't have an image selected
            req.body.FoodImage = "";
            addFoodToHouse(req, res);
          } else {
            res.status(200).send(result.response);
          }
        })
        .catch((error) => {
          console.log(`Internal Server Error: ${error}`);
          // Internal server error
          res
            .status(500)
            .send([{}, `Internal Server Error: ${error}`]);
        });
    }
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

app.patch(
  "/houses/updateFood/:houseId",
  authenticateUser,
  async (req, res) => {
    const { houseId } = req.params;
    const { deletedFoodId } = req.body;

    try {
      const result = await houseServices.removeFoodFromHouse(
        houseId,
        deletedFoodId
      );

      if (!result.success) {
        return res.status(400).send(result.message);
      }

      res.status(200).send(result);
    } catch (err) {
      console.log("Error updating house:", err);
      res.status(500).send("Internal server error.");
    }
  }
);

// Update a house by ID
app.patch(
  "/houses/:houseId",
  authenticateUser,
  async (req, res) => {
    const { houseId } = req.params;
    const updateData = req.body;

    try {
      const user = await userServices.findUserByEmail(
        req.userEmail
      );
      if (!user) {
        return res.status(404).send("User not found");
      }

      // check if user is owner or authorized
      const result = await userHouseServices.findUserHouse(
        user._id,
        houseId
      );
      const userHouse = null;
      if (result.success) {
        userHouse = result.userHouse;
      } else {
        return res.status(500).send(result.message);
      }

      if (!userHouse || userHouse.role !== "owner") {
        return res
          .status(403)
          .send("You are not authorized to update this house.");
      }

      const updatedHouse = await houseServices.updateHouseById(
        houseId,
        updateData
      );
      if (!updatedHouse) {
        return res.status(404).send("House not found.");
      }

      res.status(200).send(updatedHouse);
    } catch (error) {
      console.log("Error updating house:", error);
      res.status(500).send(`Internal Server Error: ${error}`);
    }
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
  const requestedEmail = req.query.email; // ?email=something@example.com

  let emailToUse = req.userEmail; // Default to logged-in user's email

  if (requestedEmail) {
    emailToUse = requestedEmail;
  }

  try {
    const user = await userServices.findUserByEmail(emailToUse);
    const housesResult =
      await userHouseServices.getHousesByUser(user._id);

    if (!housesResult.success) {
      return res.status(404).send(housesResult.message);
    }

    let defaultHouse = null;
    const defaultHouseId = user.defaultHouse;

    if (defaultHouseId) {
      const defaultHouseResult =
        await houseServices.findHouseById(defaultHouseId);
      if (defaultHouseResult.success) {
        defaultHouse = defaultHouseResult.house;
      }
    }

    res.send({
      housesByUser: housesResult.housesByUser,
      defaultHouse
    });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error}`);
  }
});

/* -------------------- FOOD -------------------- */
function validateRes(res) {
  return res !== undefined && res !== null;
}

//Add food
app.post("/food", (req, res) => {
  const image = req.body.foodImage;
  if (image != undefined) {
    console.log("Attempting add");
    // User has selected an image (or not), so attempt to add the food to the database
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
  } else {
    // generate images to do?
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
  }
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

app.delete("/food/:id", authenticateUser, async (req, res) => {
  const foodId = req.params.id;
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

export { app };
