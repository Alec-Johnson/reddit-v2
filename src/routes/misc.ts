// Collection of route for misc purposes, not specfific to posts or users etc
import { Request, Response, Router } from "express";
import { getConnection } from "typeorm";

import Comment from "../entities/Comment";
import Post from "../entities/Post";
import User from "../entities/User";
import Vote from "../entities/Vote";
import Sub from "../entities/Sub";

import auth from "../middleware/auth";
import user from "../middleware/user";

const vote = async (req: Request, res: Response) => {
	const { identifier, slug, commentIdentifier, value } = req.body;

	// Validate vote value
	if (![-1, 0, 1].includes(value)) {
		return res.status(400).json({ value: "Value must be -1, 0, or 1" });
	}

	try {
		const author: User = res.locals.user;
		let post = await Post.findOneOrFail({ identifier, slug });
		let vote: Vote | undefined;
		let comment: Comment | undefined;

		if (commentIdentifier) {
			// if commentIdentifier -> find vote by comment
			comment = await Comment.findOneOrFail({ identifier: commentIdentifier });
			vote = await Vote.findOne({ author, comment });
		} else {
			// if no commentIdentifier -> find vote by post
			vote = await Vote.findOne({ author, post });
		}

		if (!vote && value === 0) {
			// if no vote and value is 0 -> throw error
			return res.status(404).json({ error: "Vote not found" });
		} else if (!vote) {
			// if no vote -> create new vote
			vote = new Vote({ author, value });
			if (comment) vote.comment = comment;
			else vote.post = post;
			await vote.save();
		} else if (value === 0) {
			// If vote exists and value = 0, delete vote
			await vote.remove();
		} else if (vote.value !== value) {
			// If vote exists and value is different, update vote
			vote.value = value;
			await vote.save();
		}

		// Return vote
		post = await Post.findOneOrFail(
			{ identifier, slug },
			{ relations: ["comments", "comments.votes", "sub", "votes"] }
		);
		post.setUserVote(author);
		post.comments.forEach((c) => c.setUserVote(author));

		return res.json(post);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: "Something went wrong" }); // No need for better client side error handling
	}
};

const topSubs = async (_: Request, res: Response) => {
	try {
		/**
		 * SELECT s.title, s.name,
		 * COALESCE('http://localhost:5000/images/' || s."imageUrn", 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y') AS "imageUrl",
		 * count(p.id) AS "postCount"
		 * FROM subs s
		 * LEFT JOIN posts p ON s.name = p."subName"
		 * GROUP BY s.name, s.title, imageUrl
		 * ORDER BY "postCount" DESC
		 * LIMIT 5;
		 */
		// If sub has imageUrn, concat to baseUrl of server and images directory
		// Else, use gravatar default image as URL
		const imageUrlExp = `COALESCE('${process.env.APP_URL}/images/' || s."imageUrn" , 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y')`;
		const subs = await getConnection()
			.createQueryBuilder()
			.select(
				`s.title, s.name, ${imageUrlExp} as "imageUrl", count(p.id) as "postCount"`
			)
			.from(Sub, "s")
			.leftJoin(Post, "p", `s.name = p."subName"`)
			.groupBy('s.name, s.title, "imageUrl"')
			.orderBy(`"postCount"`, "DESC")
			.limit(5)
			.execute();

		return res.json(subs);
	} catch (err) {
		return res.status(500).json({ error: "Something went wrong" }); // No need for better client side error handling
	}
};

const router = Router();
router.post("/vote", user, auth, vote);
router.get("/top-subs", topSubs);

export default router;
