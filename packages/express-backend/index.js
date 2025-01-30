import express from "express";
import cors from "cors";
import userServices from "./user-services.js";



//Initialize app and users list
const app = express();
const port = 8000;

//For Cross-Origin Resource Sharing and json
app.use(cors());
app.use(express.json());

app.post("/users", (req, res) => {
	//Handle post request (adding a user)
	const userToAdd = req.body;

	let result = userServices.addUser(userToAdd);
	result.then((result) => res.status(201).send(result))
	.catch((error) => res.status(500).send(`Internal Server Error: ${error}`));
});

app.get("/", (req, res) => {
	//Default 'home' page
	res.send("Hello World!");
});

app.get("/users/:id", (req, res) => {
	//Get user by id logic
	const id = req.params["id"];

	let result = userServices.findUserById(id);
	result.then((result) => {
		if (!result || result === undefined){
			res.status(404).send("Resource not found.");
		}else {
			res.send(result);
		}
	})
	.catch((error) => res.status(500).send(`Internal Server Error: ${error}`));
});

app.delete("/users/:id", (req, res) => {
	//Delete user by id logic
	const id = req.params["id"];
	let result = userServices.findUserById(id);
	result.then((result) => {
		if (!result || result === undefined) {
			return res.status(404).send("Resource not found.");
		}
		//Delete user here
		return userServices.deleteUserById(id).then(() => { res.status(204).send(); })
		.catch((error) => res.status(500).send(`Internal Server Error: ${error}`));
		}
	)
	.catch((error) => res.status(500).send(`Internal Server Error: ${error}`));
});

app.get("/users", (req, res) => {
	//Get users (with optional queries for specific name and/or job)
	const name = req.query.name;
	const job = req.query.job;
	let result;
	if (name !== undefined && job !== undefined){
		result = userServices.findUserByNameAndJob(name, job);
	}else if (name != undefined) {
		result = userServices.findUserByName(name);
	}else if (job != undefined) {
		result = userServices.findUserByJob(job);
	}else {
		result = userServices.getUsers();
	}
		
	result.then((result) => {
		if (result === undefined) {
			res.status(404).send("Resource not found.");
		}else {
			res.send({users_list: result})
		}
	})
	.catch((error) => res.status(500).send(`Internal Server Error: ${error}`));
});

app.listen(port, () => {
	//Listening to port
	console.log(
		`Example app listening at http://localhost:${port}`
	);
});
