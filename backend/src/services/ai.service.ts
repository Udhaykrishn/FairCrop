import { Readable } from "node:stream";
import axios from "axios";
import { injectable } from "inversify";

@injectable()
export class AiService {
    private readonly fastApiUrl =
        process.env.FASTAPI_URL || "http://localhost:8000/api/chat";

    public async generateResponse(
        humanMessage: string,
        history: any[],
        context?: any,
    ): Promise<string> {
        try {
            const response = await axios.post(
                this.fastApiUrl,
                { message: humanMessage, history: history, context: context },
            );

            return typeof response.data === 'string'
                ? response.data
                : (response.data.response || response.data.text || JSON.stringify(response.data));
        } catch (error: any) {
            console.error(
                "Error communicating with External AI service:",
                error.message,
            );
            return `Sorry, I couldn't reach the backend LLM service (${error.message}).`;
        }
    }
}
