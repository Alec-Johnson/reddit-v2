import {
	Entity as TOEntity,
	Column,
	Index,
	BeforeInsert,
	OneToMany,
} from "typeorm";
import bcrypt from "bcrypt";
import { IsEmail, Length } from "class-validator";
import { Exclude, Expose } from "class-transformer";

import Entity from "./Entity";
import Post from "./Post";
import Vote from "./Vote";

@TOEntity("users")
export default class User extends Entity {
	constructor(user: Partial<User>) {
		// Partial is used to avoid passing all properties
		// Call the parent constructor, inherited from BaseEntity
		super();
		Object.assign(this, user);
	}

	@Index()
	@IsEmail(undefined, { message: "Email is not valid" })
	@Length(1, 255, { message: "Email is empty" })
	@Column({ unique: true })
	email: string;

	@Index()
	@Length(3, 255, { message: "Must be at least 3 characters" })
	@Column({ unique: true })
	username: string;

	@Exclude()
	@Column()
	@Length(6, 255, { message: "Must be at least 6 characters" })
	password: string;

	@Column({ nullable: true })
	imageUrn: string;

	@OneToMany(() => Post, (post) => post.author)
	posts: Post[];

	@OneToMany(() => Vote, (vote) => vote.author)
	votes: Vote[];

	@BeforeInsert()
	async hashPassword() {
		this.password = await bcrypt.hash(this.password, 7);
	}

	@Expose()
	get imageUrl(): string {
		return this.imageUrn
			? `${process.env.APP_URL}/images/${this.imageUrn}`
			: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
	}
}
