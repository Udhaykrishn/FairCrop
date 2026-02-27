import { IsString, IsEmail, IsInt, Min, IsOptional } from "class-validator";

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
