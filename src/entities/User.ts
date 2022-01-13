import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("users") // Define table name
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	firstName: string;

	@Column()
	lastName: string;

	@Column()
	age: number;
}
