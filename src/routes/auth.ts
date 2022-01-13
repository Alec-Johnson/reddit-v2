import { Request, Response, Router } from "express";
import { User } from "../entities/User";

const register = async (req: Request, res: Response) => {
	const { email, username, password } = req.body;

	try {
		// TODO: Validate data
		// TODO: Create user
		const user = new User({ email, username, password });
		await user.save();
		// TODO: Return the user
		return res.json(user);
	} catch (err) {
		return res.status(500).json({
			error: err,
		});
	}
};

const router = Router();
router.post("/register", register);

export default router;
