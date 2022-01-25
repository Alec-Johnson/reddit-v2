import { NextFunction, Request, Response } from "express";
import User from "../entities/User";

// If we want a route that requires a user to be logged in, we use both middleware (auth and user middleware)
// If we have a route that doesn't require a user to be logged in, but when the user is logged in
// functionality changes, we use only user midddleware

export default async (_: Request, res: Response, next: NextFunction) => {
	try {
		const user: User | undefined = res.locals.user;

		if (!user) throw new Error("Not authenticated");

		return next();
	} catch (err) {
		return res.status(401).json({ error: err.message });
	}
};
