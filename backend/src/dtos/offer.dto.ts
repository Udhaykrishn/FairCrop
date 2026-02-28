import {
	IsInt,
	IsNumber,
	IsOptional,
	IsString,
} from "class-validator";

export class CreateOfferDto {
	@IsString()
	cropId!: string;

	@IsInt()
	quantity!: number;

	@IsNumber()
	price!: number;

	@IsString()
	location!: string;

	@IsString()
	buyerId!: string;
}

export class UpdateOfferDto {
	@IsOptional()
	status!: string;
}
