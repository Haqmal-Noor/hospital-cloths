import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/database.js";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/orders.js";
import userRoutes from "./routes/users.js";
import statsRoutes from "./routes/stats.js";
import personRoutes from "./routes/staff.js";

import AppError from "./utils/appError.js";
import globalErrorHandler from "./controllers/errorController.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/customers/people", personRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// const frontendPath = path.join(__dirname, "../dist"); // adjust if dist is elsewhere
// app.use(express.static(frontendPath));

// Error handling middleware
app.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({
//     message: "Something went wrong!",
//     error: process.env.NODE_ENV === "development" ? err.message : {},
//   });
// });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
