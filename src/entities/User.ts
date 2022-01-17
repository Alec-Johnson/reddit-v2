import {
	Entity as TOEntity,
	Column,
	Index,
	BeforeInsert,
	OneToMany,
} from "typeorm";
import bcrypt from "bcrypt";
import { IsEmail, Length } from "class-validator";
import { Exclude } from "class-transformer";

import Entity from "./Entity";
import { Post } from "./Post";

@TOEntity("users")
export default class User extends Entity {
	constructor(user: Partial<User>) {
		// Partial is used to avoid passing all properties
		// Call the parent constructor, inherited from BaseEntity
		super();
		Object.assign(this, user);
	}

	@Index()
	@IsEmail()
	@Column({ unique: true })
	email: string;

	@Index()
	@Length(3, 255, { message: "Username must be at least 3 characters" })
	@Column({ unique: true })
	username: string;

	@Exclude()
	@Column()
	@Length(6, 255)
	password: string;

	@OneToMany(() => Post, (post) => post.author)
	posts: Post[];

	@BeforeInsert()
	async hashPassword() {
		this.password = await bcrypt.hash(this.password, 7);
	}
}
