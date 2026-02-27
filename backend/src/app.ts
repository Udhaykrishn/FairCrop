import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route";
import farmerRoutes from "./routes/farmer.route";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Map Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/farmer", farmerRoutes);

// Basic route
app.get("/", (req, res) => {
    res.send("API is running...");
});

export default app;
