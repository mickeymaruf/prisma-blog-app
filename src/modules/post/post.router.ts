import express from "express";
import { PostController } from "./post.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/", PostController.getPosts);
router.post("/", auth("USER"), PostController.createPost);

export const PostRouter = router;
