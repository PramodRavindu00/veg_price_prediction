import "dotenv/config";
import express, { json, urlencoded } from "express";
import connectDB from "./config/db.mjs";
import cookieParser from "cookie-parser";
import cors from "cors";
import MarketRoutes from "./routes/MarketRoutes.mjs";
import AuthRoutes from "./routes/AuthRoutes.mjs";
import VegetableRoutes from "./routes/VegetableRoutes.mjs";
import PredictionRoutes from "./routes/PredictionRoutes.mjs";
import UserRoutes from "./routes/UserRoutes.mjs";
import QueryRoutes from "./routes/QueryRoutes.mjs";
import MaintenanceRoutes from "./routes/MaintenanceRoutes.mjs";

const port = process.env.PORT || 8080;
const app = express();

app.get("/", (req, res) => {
  res.status(200).send("<h1>Express Server is running</h1>");
});

app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cookieParser());

app.use(MarketRoutes);
app.use(AuthRoutes);
app.use(VegetableRoutes);
app.use(PredictionRoutes);
app.use(UserRoutes);
app.use(QueryRoutes);
app.use(MaintenanceRoutes);

app.listen(port, () => {
  console.log(`Server started running on port : ${port}`);
  connectDB();
});
