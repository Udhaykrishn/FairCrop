import { IsEmail, IsInt, IsOptional, IsString, Min } from "class-validator";

export class CreateUserDto {
	@IsString()
	name!: string;

	@IsEmail()
	email!: string;

	@IsOptional()
	@IsInt()
	@Min(1)
	age?: number;
}
