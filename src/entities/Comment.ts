import {
	BeforeInsert,
	Column,
	Entity as TOEntity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
} from "typeorm";

import Entity from "./Entity";
import User from "./User";
import Post from "./Post";

import { makeId } from "../util/helpers";
import Vote from "./Vote";
import { Exclude, Expose } from "class-transformer";

@TOEntity("comments")
export default class Comment extends Entity {
	constructor(comment: Partial<Comment>) {
		super();
		Object.assign(this, comment);
	}

	@Index()
	@Column()
	identifier: string;

	@Column()
	body: string;

	@Column()
	username: string;

	@ManyToOne(() => User)
	@JoinColumn({ name: "username", referencedColumnName: "username" })
	author: User;

	@ManyToOne(() => Post, (post) => post.comments, { nullable: false })
	post: Post;

	@Exclude()
	@OneToMany(() => Vote, (vote) => vote.comment)
	votes: Vote[];

	@Expose() get voteScore(): number {
		return this.votes?.reduce((prev, curr) => prev + (curr.value || 0), 0);
	}

	protected userVote: number;
	setUserVote(author: User) {
		const index = this.votes?.findIndex((v) => v.username === author.username);
		this.userVote = index > -1 ? this.votes[index].value : 0;
	}

	@BeforeInsert()
	makeIdAndSlug() {
		this.identifier = makeId(8);
	}
}
