import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt">
) => {
  return await prisma.post.create({ data });
};

const getPosts = async () => {
  return await prisma.post.findMany();
};

export const PostService = {
  createPost,
  getPosts,
};
