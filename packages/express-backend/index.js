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

dotenv.config(); //Load dotenv
mongoose.set("debug", true);

//Initialize app and users list
const app = express();
const port = 8000;

//For Cross-Origin Resource Sharing and json
app.use(cors());
app.use(express.json());

//Connect to database
mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1); //Exit the app if the database connection fails
  });

/* -------------------- USERS -------------------- */
function generateAccessToken(name) {
  return jwt.sign({ name: name }, process.env.TOKEN_SECRET, {
    expiresIn: "600s"
  });
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
    const token = generateAccessToken(name);
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
app.post("/login", (req, res) => {
  userServices
  .getUsers({email : req.body.email})
  .then((result) => {
    if (!result) return res.status(404).send("Resource not found.");

    //TEMPORARY PASSWORD

    if (req.body.password === result.password){
      // CORRECT PASSWORD
    } else {
      // WRONG PASSWORD
    }

    console.log(result);
    res.send(result);
  })
  .catch((error) =>
    res.status(500).send(`Internal Server Error: ${error}`)
  );
})


/* -------------------- HOUSES -------------------- */
//Add a house
app.post("/houses", (req, res) => {
  houseServices
    .createHouse(req.body)
    .then((result) => res.status(201).send(result))
    .catch((error) =>
      res.status(500).send(`Internal Server Error: ${error}`)
    );
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
app.post("/houses/:houseId/food/:location", (req, res) => {
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
});

//Get all food items from a specific location in a house
app.get("/houses/:houseId/food/:location", (req, res) => {
  const houseId = req.params.houseId;
  const location = req.params.location;

  houseServices
    .getFoodFromHouse(houseId, location)
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
});

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
app.get("/users/:userId/houses", (req, res) => {
  const { userId } = req.params;
  userHouseServices
    .getHousesByUser(userId)
    .then((result) => {
      if (!result.success)
        return res.status(404).send(result.message);
      res.send(result.housesByUser);
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
app.get("/expiring", (req, res) => {
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

app.listen(port, () => {
  //Listening to port
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});