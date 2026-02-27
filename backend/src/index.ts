import "reflect-metadata";
import app from "./app";
import { connectDB } from "./config/db.config";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
	await connectDB();

	app.listen(PORT, () => {
		console.log(`Server is running on http://localhost:${PORT}`);
	});
};

startServer();
