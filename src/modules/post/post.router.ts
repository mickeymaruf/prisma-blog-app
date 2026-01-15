import express from "express";
import { PostController } from "./post.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.get("/", PostController.getPosts);
router.get("/:id", PostController.getPostById);
router.post("/", auth(UserRole.USER), PostController.createPost);

export const PostRouter = router;
