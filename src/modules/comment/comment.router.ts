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
router.put(
  "/:commentId",
  auth(UserRole.USER, UserRole.ADMIN),
  CommentController.updateComment
);
router.patch(
  "/:commentId/status",
  auth(UserRole.ADMIN),
  CommentController.updateCommentStatus
);
router.delete(
  "/:commentId",
  auth(UserRole.USER, UserRole.ADMIN),
  CommentController.deleteComment
);

export const CommentRouter = router;
