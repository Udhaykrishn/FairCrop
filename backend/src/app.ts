import express from "express";
import dotenv from "dotenv";
dotenv.config();
import userRoutes from "./routes/user.route";
import farmerRoutes from "./routes/farmer.route";
import offerRouter from "./routes/offer.router"


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/users", userRoutes);
app.use("/api/farmer", farmerRoutes);
app.use("/api/v1/offers", offerRouter);

app.get("/", (req, res) => {
    res.json({ message: "API is running..." });
});

export default app;
