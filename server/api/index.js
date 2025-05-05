import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv"; // Keep this for local testing if needed
import postsRoutes from "../routes/posts.js"; // Adjust the path relative to server/api/

const app = express();

// Load environment variables if running locally
// Vercel handles environment variables separately via its dashboard
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// Use the routes
// Requests to /api/posts will be handled by this route
app.use("/posts", postsRoutes);

// Optional: Add a root route for testing the deployment
app.get("/", (req, res) => {
  res.send("API is running!");
});

// Connect to MongoDB
const CONNECTION_URL = process.env.CONNECTION_URL;

// Mongoose connection options - these are often not needed in recent versions
// { useNewUrlParser: true, useUnifiedTopology: true }

mongoose
  .connect(CONNECTION_URL)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => console.error("MongoDB connection error:", error.message));

// In a serverless environment, we don't use app.listen()
// Vercel provides the environment to handle incoming requests

// Export the app instance
export default app;

// import express from "express";
// import bodyParser from "body-parser";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import postsRoutes from "../routes/posts.js";

// const app = express();
// dotenv.config();

// app.use(bodyParser.json({ limit: "30mb", extended: true }));
// app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
// app.use(cors());

// app.use("/posts", postsRoutes);

// // const CONNECTION_URL =
// //   "mongodb+srv://teooboost:teooboost123@cluster0.sgd0sce.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// const CONNECTION_URL = process.env.CONNECTION_URL;

// const PORT = process.env.PORT || 5000;

// mongoose
//   .connect(CONNECTION_URL, {
//     // useNewUrlParser: true,
//     // useUnifiedTopology: true,
//   })
//   .then(() =>
//     app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
//   )
//   .catch((error) => console.log(error.message));

// // Routes

// // z1ftkBJwc9u664Uk
