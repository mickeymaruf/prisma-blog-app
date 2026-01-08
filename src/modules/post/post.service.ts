import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost = async (
  userId: string,
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">
) => {
  return await prisma.post.create({ data: { ...data, authorId: userId } });
};

const getPosts = async () => {
  return await prisma.post.findMany();
};

export const PostService = {
  createPost,
  getPosts,
};
