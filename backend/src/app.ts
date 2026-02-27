import "reflect-metadata";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

import cors from "cors";
import offerRouter from "./routes/offer.router";
import userRoutes from "./routes/user.route";

const app = express();

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
app.use("/api/v1/offers", offerRouter);

app.get("/", (_req, res) => {
	res.json({ message: "API is running..." });
});

export default app;
