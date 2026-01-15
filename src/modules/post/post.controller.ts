import { Request, Response } from "express";
import { PostService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";

const createPost = async (req: Request, res: Response) => {
  try {
    const result = await PostService.createPost(
      req.user?.id as string,
      req.body
    );

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

    const page = Number(req.query.page ?? 1);
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    const result = await PostService.getPosts({
      search: searchQuery,
      tags: tagsQuery,
      featured: featuredQuery,
      authorId: author as string,
      status: statusQuery,
      limit,
      page,
      skip,
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

export const PostController = {
  createPost,
  getPosts,
};
