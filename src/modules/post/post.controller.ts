import { Request, Response } from "express";
import { PostService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { UserRole } from "../../middlewares/auth";

const getPosts = async (req: Request, res: Response) => {
  try {
    const { search, tags, featured, author, status } = req.query;
    const searchQuery = search ? search.toString() : "";
    const tagsQuery = tags ? tags.toString().split(",") : [];
    const featuredQuery = featured ? featured === "true" : undefined;
    const statusQuery = status as PostStatus;

    if (statusQuery && !Object.values(PostStatus).includes(statusQuery)) {
      return res.status(400).json({
        success: false,
        message:
          "Post status type is invalid! Must me any of these types: " +
          Object.values(PostStatus),
      });
    }

    const { page, limit, skip, orderBy, order } = paginationSortingHelper(
      req.query
    );

    const result = await PostService.getPosts({
      search: searchQuery,
      tags: tagsQuery,
      featured: featuredQuery,
      authorId: author as string,
      status: statusQuery,
      limit,
      page,
      skip,
      orderBy,
      order,
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) throw new Error("postId is required");
    const result = await PostService.getPostById(id);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyPosts = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({
        success: false,
        message: "Unauthorized access!",
      });
    const result = await PostService.getMyPosts(userId);

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

const createPost = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({
        success: false,
        message: "Unauthorized access!",
      });

    const result = await PostService.createPost(userId, req.body);

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

const updatePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const user = req.user;
    const isAdmin = user?.role === UserRole.ADMIN;

    // sanitize data
    const { id, views, createdAt, updatedAt, authorId, ...safeData } = req.body;

    const result = await PostService.updatePost(
      postId as string,
      user?.id as string,
      safeData,
      isAdmin
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

const deletePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user)
      return res.status(401).json({
        success: false,
        message: "Unauthorized access!",
      });

    const isAdmin = user.role === UserRole.ADMIN;

    const result = await PostService.deletePost(
      req.params.postId as string,
      user.id,
      isAdmin
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const PostController = {
  createPost,
  getPosts,
  getPostById,
  getMyPosts,
  updatePost,
  deletePost,
};
