import { validate } from "class-validator";
import { Request, Response, Router } from "express";
import { User } from "../entities/User";
import bcrypt from "bcrypt";

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

		// Validate the registration (Check if isEmail and isLength are valid in src/entities/User.ts)
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
	} catch (err) {
		return res.status(500).json({
			error: err,
		});
	}
};

const router = Router();
router.post("/register", register);

export default router;
