import "reflect-metadata";
import dotenv from "dotenv";
import express from "express";

dotenv.config();
import userRoutes from "./routes/user.route";
import farmerRoutes from "./routes/farmer.route";
import offerRouter from "./routes/offer.router";
import negotiationRouter from "./routes/negotiation.route";
import cors from "cors";
import morgan from "morgan";

const app = express();

app.use(morgan("dev"));
app.use(
	cors({
		origin: process.env.FRONTEND_URL,
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	}),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/users", userRoutes);
app.use("/api/farmer", farmerRoutes);
app.use("/api/offers", offerRouter);
app.use("/api/negotiations", negotiationRouter);

app.get("/", (_req, res) => {
	res.json({ message: "API is running..." });
});

export default app;