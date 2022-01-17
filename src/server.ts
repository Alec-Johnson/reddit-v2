import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

import trim from "./middleware/trim";

import authRoutes from "./routes/UserRouter";
import postRoutes from "./routes/posts";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(morgan("dev")); // Dev logging, nice colors
app.use(trim); // Trim all request bodies
app.use(cookieParser());

app.get("/", (req, res) => res.send("Hollow world"));
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.listen(PORT, async () => {
	console.log(`Server started on port ${PORT}`);

	try {
		await createConnection();
		console.log("Connected to DB");
	} catch (err) {
		console.log("Error connecting to DB: ", err);
	}
});
