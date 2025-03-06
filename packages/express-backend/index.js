import express from "express";
import cors from "cors";
import userServices from "./user-services.js";
import foodServices from "./food-services.js";

import mongoose from "mongoose";
import dotenv from "dotenv";

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

app.post("/users", (req, res) => {
  //Handle post request (adding a user)
  const userToAdd = req.body;

  const result = userServices.addUser(userToAdd);
  result
    .then((result) => res.status(201).send(result))
    .catch((error) =>
      res.status(500).send(`Internal Server Error: ${error}`)
    );
});

app.get("/", (req, res) => {
  //Default 'home' page
  res.send("Hello World!");
});

app.get("/users/:id", (req, res) => {
  //Get user by id logic
  const id = req.params["id"];

  const result = userServices.findUserById(id);
  result
    .then((result) => {
      if (!result || result === undefined) {
        res.status(404).send("Resource not found.");
      } else {
        res.send(result);
      }
    })
    .catch((error) =>
      res.status(500).send(`Internal Server Error: ${error}`)
    );
});

app.delete("/users/:id", (req, res) => {
  //Delete user by id logic
  const id = req.params["id"];
  const result = userServices.findUserById(id);
  result
    .then((result) => {
      if (!result || result === undefined) {
        return res.status(404).send("Resource not found.");
      }
      //Delete user here
      return userServices
        .deleteUserById(id)
        .then(() => {
          res.status(204).send();
        })
        .catch((error) =>
          res
            .status(500)
            .send(`Internal Server Error: ${error}`)
        );
    })
    .catch((error) =>
      res.status(500).send(`Internal Server Error: ${error}`)
    );
});

app.get("/users", (req, res) => {
  //Get users (with optional queries for specific name and/or job)
  const name = req.query.name;
  const job = req.query.job;
  let result;
  if (name !== undefined && job !== undefined) {
    result = userServices.findUserByNameAndJob(name, job);
  } else if (name != undefined) {
    result = userServices.findUserByName(name);
  } else if (job != undefined) {
    result = userServices.findUserByJob(job);
  } else {
    result = userServices.getUsers();
  }

  result
    .then((result) => {
      if (result === undefined) {
        res.status(404).send("Resource not found.");
      } else {
        res.send({ users_list: result });
      }
    })
    .catch((error) =>
      res.status(500).send(`Internal Server Error: ${error}`)
    );
});

app.post("/food", (req, res) => {
  console.log("Received request body:", req.body.name);
  const foodToAdd = req.body;

  const result = foodServices.addFood(foodToAdd);
  result
    .then((result) => res.status(201).send(result))
    .catch((error) =>
      res.status(500).send(`Internal Server Error: ${error}`)
    );
});

// Validate the response from our database
function validateRes(res) {
  if(!res || res == undefined) {
    return false;
  }
  console.log(res); // debugging purposes
  return true;
}

// Return all food items in our database
app.get("/food", (req, res) => {
  foodServices.getFood()
  .then((mongoRes) => {
    if(validateRes(mongoRes)) {
      res.send(mongoRes);
    } else {
      res.status(404).send("Resource not found");
    }
  })
  .catch((error) => {
    console.log(error);
    res.status(500).send(`Internal Server Error: ${error}`);
  })
});

// Search for a specific food item in our database
app.get("/food/:name", (req, res) => {
  const foodName = req.params.name;
  if (foodName != undefined) {
    foodServices.findFoodByName(foodName)
    .then((mongoRes) => {
      if(validateRes(mongoRes)) {
        res.send(mongoRes);
      } else {
        res.status(404).send("Resource not found");
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send(`Internal Server Error: ${error}`);
    })
  } else {
    res.status(404).send("Resource was not provided properly");
  }
});

app.get("/food/:name", (req, res) => {
  //Get food list for user
  const name = req.params["name"];

  let result = userServices.findFoodByName(name);

  if (food !== undefined) {
    result = foodServices.findFoodByName(food);
  } else {
    result = foodServices.getFood();
  }

  result
    .then((result) => {
      if (!result || result === undefined) {
        return res.status(404).send("Resource not found.");
      }
      console.log(result);
      res.send(result);
    })
    .catch((error) =>
      res.status(500).send(`Internal Server Error: ${error}`)
    );
});

app.listen(port, () => {
  //Listening to port
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});
