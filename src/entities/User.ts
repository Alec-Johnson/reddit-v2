import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	CreateDateColumn,
	UpdateDateColumn,
	Index,
	BeforeInsert,
} from "typeorm";
import bcrypt from "bcrypt";
import { IsEmail, Length } from "class-validator";
import { Exclude, instanceToPlain } from "class-transformer";

@Entity("users") // Define table name
export class User extends BaseEntity {
	constructor(user: Partial<User>) {
		// Partial is used to avoid passing all properties
		// Call the parent constructor, inherited from BaseEntity
		super();
		Object.assign(this, user);
	}
	@Exclude()
	@PrimaryGeneratedColumn()
	id: number;

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

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@BeforeInsert()
	async hashPassword() {
		this.password = await bcrypt.hash(this.password, 7);
	}

	toJSON() {
		return instanceToPlain(this); // Convert class to plain object
	}
}
