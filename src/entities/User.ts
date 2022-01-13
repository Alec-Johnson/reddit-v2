import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	CreateDateColumn,
	UpdateDateColumn,
} from "typeorm";

@Entity("users") // Define table name
export class User extends BaseEntity {
	constructor(user: Partial<User>) {
		// Partial is used to avoid passing all properties
		// Call the parent constructor, inherited from BaseEntity
		super();
		Object.assign(this, user);
	}
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	email: string;

	@Column({ unique: true })
	username: string;

	@Column()
	password: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
