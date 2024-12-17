import dotenv from "dotenv";
import express, { json, urlencoded } from "express";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import marketRoutes from "./routes/marketRoutes.mjs";
import authRoutes from "./routes/authRoutes.mjs";

dotenv.config({ path: "../.env" });

const app = express();

app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cookieParser());

app.use(marketRoutes);
app.use(authRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server started running on port : ${port}`);
  connectDB();
});
