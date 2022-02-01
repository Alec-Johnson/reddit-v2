import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

import trim from "./middleware/trim";

import authRoutes from "./routes/auth";
import postRoutes from "./routes/posts";
import subRoutes from "./routes/subs";
import miscRoutes from "./routes/misc";
import userRoutes from "./routes/users";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(morgan("dev")); // Dev logging, nice colors
app.use(trim); // Trim all request bodies
app.use(cookieParser());
app.use(
	cors({
		credentials: true,
		origin: process.env.ORIGIN,
		optionsSuccessStatus: 200,
	})
);

app.use(express.static("public"));

app.get("/", (_, res) => res.send("Hollow world"));
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/subs", subRoutes);
app.use("/api/misc", miscRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, async () => {
	console.log(`Server started on port ${PORT}`);

	try {
		await createConnection();
		console.log("Connected to DB");
	} catch (err) {
		console.log("Error connecting to DB: ", err);
	}
});
