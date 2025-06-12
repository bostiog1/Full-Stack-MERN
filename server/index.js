import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import postsRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
// app.use(cors());
// app.use(cors({ origin: "http://localhost:5173" }));
// app.use(
//   cors({
//     origin: [
//       "https://silver-daffodil-5a27f1.netlify.app",
//       "http://localhost:5173",
//     ],
//     credentials: true,
//   })
// );

// app.use(cors({ origin: "*" })); // Remove in production!

// TEMPORARY FIX - Allow all origins for testing
app.use(
  cors({
    origin: [
      "https://silver-daffodil-5a27f1.netlify.app", // Your Netlify URL
      "http://localhost:5173", // For local development
    ],
    credentials: true,
  })
);

app.use("/posts", postsRoutes);
app.use("/user", userRoutes);


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
