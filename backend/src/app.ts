import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Map Routes
app.use("/api/v1/users", userRoutes);

// Basic route
app.get("/", (req, res) => {
    res.send("API is running...");
});

export default app;
