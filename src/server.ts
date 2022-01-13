import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import morgan from "morgan";

const app = express();

app.use(express.json());
app.use(morgan("dev")); // Dev logging, nice colors

app.get("/", (req, res) => res.send("Hollow world"));

app.listen(5000, async () => {
	console.log("Server started on port 5000");

	try {
		await createConnection();
		console.log("Connected to DB");
	} catch (err) {
		console.log("Error connecting to DB: ", err);
	}
});
