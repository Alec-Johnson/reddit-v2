import { isEmpty, validate } from "class-validator";
import { Request, Response, Router } from "express";
import User from "../entities/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import auth from "../middleware/auth";

const register = async (req: Request, res: Response) => {
	const { email, username, password } = req.body;

	try {
		// Check if the user already exists
		let errors: any = {};
		const emailUser = await User.findOne({ email });
		const usernameUser = await User.findOne({ username });

		if (emailUser) errors.email = "Email is already taken";
		if (usernameUser) errors.email = "Username is already taken";

		if (Object.keys(errors).length > 0) {
			return res.status(400).json({ errors });
		}
		// Create a new user
		const user = new User({ email, username, password });

		// Validate the registration (Check if isEmail and Length are valid in src/entities/User.ts)
		errors = await validate(user);

		if (errors.length > 0) {
			return res.status(400).json({ errors });
		}

		await user.save();

		return res.json(user);
	} catch (err) {
		return res.status(500).json({
			error: err,
		});
	}
};

const login = async (req: Request, res: Response) => {
	// Take username and password from the request
	const { username, password } = req.body;
	// Look for the user in the database
	try {
		let errors: any = {};
		if (isEmpty(username)) errors.username = "Username is required";
		if (isEmpty(password)) errors.password = "Password is required";

		// If we have errors, return them
		if (Object.keys(errors).length > 0) {
			return res.status(400).json(errors);
		}

		const user = await User.findOne({ username });

		if (!user) return res.status(404).json({ error: "User not found" });

		// If the user exists, compare the password
		// user.password is the hashed password, password is the plain text password
		const passwordMatches = await bcrypt.compare(password, user.password);

		// Return an error if the password doesn't match, but only for the password input
		// We are telling the user that the password is incorrect, when some apps wouldn't
		if (!passwordMatches) {
			return res.status(401).json({ password: "Password does not match" });
		}

		// Create a token and sign it with the username
		const token = jwt.sign({ username }, process.env.JWT_SECRET!);
		// Set headers on the response object and store on client side as a cookie
		res.set(
			"Set-Cookie",
			cookie.serialize("token", token, {
				httpOnly: true, // Can't be accessed by the client, more secure
				secure: process.env.NODE_ENV === "production", // Only send the cookie over HTTPS
				sameSite: "strict", // Cookie should only come from our domain
				maxAge: 3600, // Cookie will expire after 1 hour
				path: "/", // Valid across all paths, default is /api/auth
			})
		);

		return res.json(user);
	} catch (err) {
		return res.status(500).json({
			error: err,
		});
	}
};

// Will tell the user whether they are authenticated or not
const me = (_: Request, res: Response) => {
	return res.json(res.locals.user);
};

const logout = (_: Request, res: Response) => {
	res.set(
		"Set-Cookie",
		cookie.serialize("token", "", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			expires: new Date(0), // Cookie will expire immediately
			path: "/",
		})
	);

	return res.status(200).json({ success: true });
};

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, me);
router.get("/logout", auth, logout);

export default router;
