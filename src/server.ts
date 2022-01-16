import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

import trim from "./middleware/trim";
import authRoutes from "./routes/auth";

const app = express();

app.use(express.json());
app.use(morgan("dev")); // Dev logging, nice colors
app.use(trim); // Trim all request bodies

app.get("/", (req, res) => res.send("Hollow world"));
app.use("/api/auth", authRoutes);

app.listen(5000, async () => {
	console.log("Server started on port 5000");

	try {
		await createConnection();
		console.log("Connected to DB");
	} catch (err) {
		console.log("Error connecting to DB: ", err);
	}
});
