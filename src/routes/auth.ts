import { Request, Response, Router } from "express";

const register = (req: Request, res: Response) => {
	const { email, username, password } = req.body;

	try {
		// TODO: Validate data
		// TODO: Create user
		// TODO: Return the user
	} catch (err) {}
};

const router = Router();
router.post("/register", register);

export default router;
