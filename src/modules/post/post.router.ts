import express from "express";
import { PostController } from "./post.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.get("/", PostController.getPosts);
router.get("/my-posts", auth(UserRole.USER), PostController.getMyPosts);
router.get("/:id", PostController.getPostById);
router.post("/", auth(UserRole.USER), PostController.createPost);
router.patch(
  "/:postId",
  auth(UserRole.USER, UserRole.ADMIN),
  PostController.updatePost
);
router.delete(
  "/:postId",
  auth(UserRole.USER, UserRole.ADMIN),
  PostController.deletePost
);

export const PostRouter = router;
