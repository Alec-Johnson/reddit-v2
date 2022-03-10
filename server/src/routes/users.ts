import { Request, Response, Router } from "express";
import fs, { PathLike } from "fs";
import multer, { FileFilterCallback } from "multer";
import path from "path";

import Comment from "../entities/Comment";
import Post from "../entities/Post";
import User from "../entities/User";

import auth from "../middleware/auth";
import user from "../middleware/user";

import { makeId } from "../util/helpers";

const getUserSubmissions = async (req: Request, res: Response) => {
	try {
		const author = await User.findOneOrFail({
			where: { username: req.params.username },
			select: ["username", "createdAt", "imageUrn"],
		});

		const posts = await Post.find({
			where: { author },
			relations: ["comments", "votes", "sub"],
		});

		const comments = await Comment.find({
			where: { author },
			relations: ["post"],
		});

		if (res.locals.user) {
			posts.forEach((p) => p.setUserVote(res.locals.user));
			comments.forEach((c) => c.setUserVote(res.locals.user));
		}

		let submissions: any[] = [];
		posts.forEach((p) => submissions.push({ type: "Post", ...p.toJSON() }));
		comments.forEach((c) =>
			submissions.push({ type: "Comment", ...c.toJSON() })
		);

		submissions.sort((a, b) => {
			if (b.createdAt > a.createdAt) return 1;
			if (b.createdAt < a.createdAt) return -1;
			return 0;
		});

		return res.json({ author, submissions });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: "Something went wrong" });
	}
};

const upload = multer({
	storage: multer.diskStorage({
		destination: "public/images",
		filename: (_, file, cb) => {
			const name = makeId(15);
			cb(null, name + path.extname(file.originalname)); // e.g. asdasda123easd.png
		},
	}),
	fileFilter: (_, file, cb: FileFilterCallback) => {
		if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
			cb(null, true);
		} else {
			cb(new Error("File is not an image"));
		}
	},
});

const uploadProfileImage = async (req: Request, res: Response) => {
	const user: User = res.locals.user;
	try {
		const type = req.body.type;

		if (type !== "profileImage") {
			fs.unlinkSync(req?.file?.path as PathLike);
			return res.status(400).json({ error: "Invalid type" });
		}

		// Delete old image if exists, replace with new one
		let oldImageUrn: string = "";
		if (type === "profileImage") {
			oldImageUrn = user.imageUrn || "";
			user.imageUrn = req?.file?.filename as string;
		}
		await user.save();

		if (oldImageUrn !== "") {
			fs.unlinkSync(`public\\images\\${oldImageUrn}`);
		}

		return res.json(user);
	} catch (err) {
		return res.status(500).json({ error: "Something went wrong" });
	}
};

const router = Router();

router.get("/:username", user, getUserSubmissions);
router.post(
	"/:username/image",
	user,
	auth,
	upload.single("file"),
	uploadProfileImage
);

export default router;
