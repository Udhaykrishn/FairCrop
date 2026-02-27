import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class SendMessageDto {
	@IsString()
	@IsNotEmpty()
	message!: string;

	@IsString()
	@IsOptional()
	sessionId?: string;

	@IsNumber()
	@IsOptional()
	offer_price?: number;

	@IsNumber()
	@IsOptional()
	counter_price?: number;
}
