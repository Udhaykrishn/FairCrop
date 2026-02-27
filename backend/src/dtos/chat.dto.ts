import { IsNotEmpty, IsOptional, IsString, IsNumber } from "class-validator";

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
}
