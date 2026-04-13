import { Router } from "express";
import {
  addToLikedMovies,
  getLikedMovies,
  removeFromlikedMovies
} from "../controllers/user.controller.js";

const router = Router();
router.post("/add", addToLikedMovies);
router.get("/liked/:email", getLikedMovies);
router.put("/delete", removeFromlikedMovies)

export default router;


