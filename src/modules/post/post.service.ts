import { Post, PostStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createPost = async (
  userId: string,
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">
) => {
  return await prisma.post.create({ data: { ...data, authorId: userId } });
};

const getPosts = async ({
  search,
  tags,
  featured,
  authorId,
  status,
  limit,
  page,
  skip,
}: {
  search: string;
  tags: string[];
  featured: boolean | undefined;
  authorId: string;
  status: PostStatus;
  limit: number;
  page: number;
  skip: number;
}) => {
  const filters: PostWhereInput[] = [];

  if (status) filters.push({ status });
  if (authorId) filters.push({ authorId });
  if (tags.length) filters.push({ tags: { hasEvery: tags } });
  if (featured !== undefined) filters.push({ isFeatured: featured });

  if (search) {
    filters.push({
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
      ],
    });
  }

  const [posts, count] = await prisma.$transaction([
    prisma.post.findMany({
      where: { AND: filters },
      take: limit,
      skip: skip,
    }),
    prisma.post.count({
      where: { AND: filters },
    }),
  ]);

  return {
    pagination: {
      count,
      page,
      totalPages: Math.ceil(count / limit),
    },
    posts,
  };
};

export const PostService = {
  createPost,
  getPosts,
};
