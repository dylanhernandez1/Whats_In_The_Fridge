import { app } from "./app.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
const port = 8000;


dotenv.config(); //Load dotenv

mongoose.set("debug", true);

//Connect to database
mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1); //Exit the app if the database connection fails
  });

app.listen(process.env.PORT || port, () => {
  console.log("REST API is listening.");
});