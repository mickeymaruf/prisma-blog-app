import express from "express";
import { PostController } from "./post.controller";

const router = express.Router();

router.get("/", PostController.getPosts);
router.post("/", PostController.createPost);

export const PostRouter = router;
