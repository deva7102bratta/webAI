import express from "express"
import "dotenv/config"
import cors from "cors"
import cookieParser from "cookie-parser"

import connectDB from "./config/db.js"
import authRouter from "./routes/authRoutes.js"
import projectRouter from "./routes/projectRoutes.js"

const app = express()

// Connect to MongoDB
await connectDB()

// Allowed frontend origins
const allowedOrigins = process.env.ORIGINS
  ? process.env.ORIGINS.split(",").map((origin) => origin.trim())
  : []

// CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an origin (Postman, server-to-server, etc.)
      if (!origin) {
        return callback(null, true)
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      return callback(new Error("Not allowed by CORS"))
    },
    credentials: true,
  })
)

// Middleware
app.use(cookieParser())
app.use(express.json())

// Health check
app.get("/", (req, res) => {
  res.send("Server is Live")
})

// Routes
app.use("/api/auth", authRouter)
app.use("/api/projects", projectRouter)

// Centralized error handler
app.use((err, _req, res, _next) => {
  console.error(`[Error] ${err.message}`)

  res.status(500).json({
    error: err.message,
  })
})

// Render provides PORT automatically
const port = process.env.PORT || 5000

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`)
})
