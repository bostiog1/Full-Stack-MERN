import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import postsRoutes from "./routes/posts.js";

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
// app.use(cors());
app.use(cors({ origin: "http://localhost:5173" }));
app.use("/posts", postsRoutes);

// const CONNECTION_URL =
// "mongodb+srv://teooboost:teooboost123@cluster0.sgd0sce.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(CONNECTION_URL, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })

  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
  )
  .catch((error) => console.log(error.message));

// Routes
// z1ftkBJwc9u664Uk
