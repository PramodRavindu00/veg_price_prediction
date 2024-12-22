import dotenv from "dotenv";
import express, { json, urlencoded } from "express";
import connectDB from "./config/db.mjs";
import cookieParser from "cookie-parser";
import cors from "cors";
import marketRoutes from "./routes/marketRoutes.mjs";
import authRoutes from "./routes/authRoutes.mjs";
import vegetableRoutes from "./routes/vegetableRoutes.mjs";
import predictionRoutes from "./routes/predictionRoutes.mjs"

dotenv.config({ path: "../.env" });

const app = express();

app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cookieParser());

app.use(marketRoutes);
app.use(authRoutes);
app.use(vegetableRoutes);
app.use(predictionRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server started running on port : ${port}`);
  connectDB();
});
