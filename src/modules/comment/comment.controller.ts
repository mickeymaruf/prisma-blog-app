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

const deleteComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;

    const result = await CommentService.deleteComment(
      commentId as string,
      req.user?.id as string
    );

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

const updateComment = async (req: Request, res: Response) => {
  try {
    req.body.id = req.params.commentId;
    req.body.userId = req.user?.id;

    const result = await CommentService.updateComment(req.body);

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

const updateCommentStatus = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;

    const result = await CommentService.updateCommentStatus(
      commentId as string,
      req.body
    );

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

export const CommentController = {
  createComment,
  getCommentsByUser,
  deleteComment,
  updateComment,
  updateCommentStatus,
};
