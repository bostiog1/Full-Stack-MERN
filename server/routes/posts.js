import express from "express";
import {
  getPostsBySearch,
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  commentPost,
  deleteComment,
} from "../controllers/posts.js";

import auth from "../middleware/auth.js";

const router = express.Router();

// http://localhost:5000/posts

router.get("/search", getPostsBySearch);
router.get("/", getPosts);
router.get("/:id", getPost);

router.post("/", auth, createPost);
router.patch("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);
router.patch("/:id/likePost", auth, likePost);
router.post("/:id/commentPost", auth, commentPost);

router.delete("/comment/:id/:commentIndex", auth, deleteComment);
export default router;
