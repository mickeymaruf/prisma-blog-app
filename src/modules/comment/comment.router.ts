import { Router } from "express";
import { CommentController } from "./comment.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = Router();

router.get("/author/:authorId", CommentController.getCommentsByUser);
router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  CommentController.createComment
);

export const CommentRouter = router;
