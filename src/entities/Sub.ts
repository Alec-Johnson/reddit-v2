import {
	Entity as TOEntity,
	Column,
	Index,
	ManyToOne,
	JoinColumn,
	OneToMany,
} from "typeorm";
import { makeId, makeSlug } from "../util/helpers";

import Entity from "./Entity";
import Post from "./Post";
import User from "./User";

@TOEntity("subs")
export default class Sub extends Entity {
	constructor(sub: Partial<Sub>) {
		super();
		Object.assign(this, sub);
	}

	@Index()
	@Column({ unique: true })
	name: string;

	@Column()
	title: string;

	@Column({ type: "text", nullable: true })
	description: string;

	@Column({ nullable: true })
	imageUrn: string; // Store the name of file, url will be generated dynamically

	@Column({ nullable: true })
	bannerUrn: string;

	@ManyToOne(() => User, (user) => user.posts)
	@JoinColumn({ name: "username", referencedColumnName: "username" })
	author: User;

	@OneToMany(() => Post, (post) => post.sub)
	posts: Post[];
}
