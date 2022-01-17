import {
	Entity as TOEntity,
	Column,
	Index,
	ManyToOne,
	JoinColumn,
	BeforeInsert,
	OneToMany,
} from "typeorm";
import { makeId, makeSlug } from "../util/helpers";
import Comment from "./Comment";

import Entity from "./Entity";
import Sub from "./Sub";
import User from "./User";

@TOEntity("posts")
export default class Post extends Entity {
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

	@ManyToOne(() => Sub, (sub) => sub.posts)
	@JoinColumn({ name: "subName", referencedColumnName: "name" })
	sub: Sub;

	@OneToMany(() => Comment, (comment) => comment.post)
	comments: Comment[];

	@BeforeInsert()
	makeIdAndSlug() {
		this.identifier = makeId(7);
		this.slug = makeSlug(this.title);
	}
}
