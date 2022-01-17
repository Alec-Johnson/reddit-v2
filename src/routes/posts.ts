import { Router, Request, Response } from "express";

import Post from "../entities/Post";
import Sub from "../entities/Sub";

import auth from "../middleware/auth";

const createPost = async (req: Request, res: Response) => {
	const { title, body, sub } = req.body;

	const author = res.locals.user;

	if (title.trim() === "") {
		return res.status(400).json({ title: "Title must not be empty" });
	}

	try {
		// Find the sub
		const subRecord = await Sub.findOneOrFail({ name: sub });

		const post = new Post({ title, body, author, sub: subRecord });
		await post.save();

		return res.json(post);
	} catch (err) {
		console.log(err);
		// Already authenticated at this point so any error is a 500
		return res.status(500).json({ error: "Something went wrong" });
	}
};

const router = Router();
router.post("/", auth, createPost);

export default router;
