const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const sessionRoutes = require("./routes/sessionRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Root route for sanity check
app.get("/", (req, res) => {
    res.json({ message: "Vi-Notes API is running" });
});

// Use routes
app.use("/api", sessionRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/vinotes";

// Connect to MongoDB
mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
        // Only start the server if we're not in a serverless environment (e.g., local dev)
        if (process.env.NODE_ENV !== "production") {
            app.listen(PORT, () => {
                console.log(`Server running on http://localhost:${PORT}`);
            });
        }
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err.message);
        // In serverless, we might not want to exit immediately, but for now it's okay
    });

// Export the app for Vercel
module.exports = app;