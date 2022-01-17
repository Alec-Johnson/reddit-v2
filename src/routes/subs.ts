import { Request, Response, Router } from "express";
import { getRepository } from "typeorm";
import { isEmpty } from "class-validator";

import User from "../entities/User";
import Sub from "../entities/Sub";
import auth from "../middleware/auth";

const createSub = async (req: Request, res: Response) => {
	const { name, title, description, imageUrn, bannerUrn } = req.body;

	const author: User = res.locals.user;

	try {
		let errors: any = {};
		if (isEmpty(name)) errors.name = "Name must not be empty";
		if (isEmpty(title)) errors.title = "Ttile must not be empty";

		const sub = await getRepository(Sub)
			.createQueryBuilder("sub")
			.where("lower(sub.name) = :name", { name: name.toLowerCase() })
			.getOne();
		if (sub) errors.name = "Sub already exists";

		if (Object.keys(errors).length > 0) {
			throw errors;
		}
	} catch (err) {
		return res.status(400).json(err);
	}
	// Everything is valid, create sub
	try {
		const sub = new Sub({ name, description, title, author });
		await sub.save();

		return res.json(sub);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: "Something went wrong" });
	}
};

const router = Router();
router.post("/", auth, createSub);

export default router;
