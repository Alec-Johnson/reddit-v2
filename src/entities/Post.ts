import {
	Entity as TOEntity,
	Column,
	Index,
	ManyToOne,
	JoinColumn,
	BeforeInsert,
} from "typeorm";
import { makeId, makeSlug } from "../util/helpers";

import Entity from "./Entity";
import User from "./User";

@TOEntity("posts")
export class Post extends Entity {
	constructor(post: Partial<Post>) {
		super();
		Object.assign(this, post);
	}

	@Index()
	@Column()
	identifier: string; // 7 character id

	@Column()
	title: string;

	@Index()
	@Column()
	slug: string;

	@Column({ nullable: true, type: "text" })
	body: string;

	@Column()
	subName: string;

	@ManyToOne(() => User, (user) => user.posts)
	@JoinColumn({ name: "username", referencedColumnName: "username" })
	author: User;

	@BeforeInsert()
	makeIdAndSlug() {
		this.identifier = makeId(7);
		this.slug = makeSlug(this.title);
	}
}
