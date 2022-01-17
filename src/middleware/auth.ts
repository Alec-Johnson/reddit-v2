import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { User } from "../entities/User";

export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.cookies.token;
		if (!token) throw new Error("No token, not authenticated");

		const { username } = jwt.verify(token, process.env.JWT_SECRET);

		const user = await User.findOne({ username });
		if (!user) throw new Error("No token, not authenticated");

		res.locals.user = user;

		return next();
	} catch (err) {
		return res.status(401).json({ error: err.message });
	}
};
