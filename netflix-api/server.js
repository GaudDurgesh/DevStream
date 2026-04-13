import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/user", userRoutes)

const PORT = process.env.PORT || 5000;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB Connected");

    app.listen(PORT, () => {
      console.log("Server running on port: " + PORT);
    });

  } catch (error) {
    console.log("Error:", error.message);
    process.exit(1); // stop app if DB fails
  }
};

connectDB();

