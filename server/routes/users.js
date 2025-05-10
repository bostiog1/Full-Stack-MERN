import express from "express";

import { auth0SignIn, signIn, signUp } from "../controllers/user.js";

const router = express.Router();

router.post("/signIn", signIn);
router.post("/signUp", signUp);
router.post("/auth0SignIn", auth0SignIn);

export default router;
