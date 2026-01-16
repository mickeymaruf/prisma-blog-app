import { Request, Response } from "express";
import { CommentService } from "./comment.service";

const getCommentsByUser = async (req: Request, res: Response) => {
  try {
    const { authorId } = req.params;
    if (!authorId) throw new Error("authorId is required!");

    const result = await CommentService.getCommentsByUser(authorId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const createComment = async (req: Request, res: Response) => {
  try {
    req.body.userId = req.user?.id;

    const result = await CommentService.createComment(req.body);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const CommentController = { createComment, getCommentsByUser };
