import { Type } from "class-transformer";
import {
	IsDefined,
	IsInt,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";

class LocationDto {
	@IsNumber()
	lat!: number;

	@IsNumber()
	lon!: number;
}

export class CreateOfferDto {
	@IsString()
	cropId!: string;

	@IsInt()
	quantity!: number;

	@IsNumber()
	price!: number;

	@IsDefined()
	@ValidateNested()
	@Type(() => LocationDto)
	location!: LocationDto;
}

export class UpdateOfferDto {
	@IsOptional()
	status!: string;
}
