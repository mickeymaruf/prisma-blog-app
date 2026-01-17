import {
  CommentStatus,
  Post,
  PostStatus,
} from "../../../generated/prisma/client";
import {
  PostUpdateInput,
  PostWhereInput,
} from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const getPosts = async ({
  search,
  tags,
  featured,
  authorId,
  status,
  limit,
  page,
  skip,
  orderBy,
  order,
}: {
  search: string;
  tags: string[];
  featured: boolean | undefined;
  authorId: string;
  status: PostStatus;
  limit: number;
  page: number;
  skip: number;
  orderBy: string;
  order: string;
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
      orderBy: {
        [orderBy]: order,
      },
      include: {
        _count: {
          select: { comments: true },
        },
      },
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

const getPostById = async (id: string) => {
  return await prisma.post.update({
    where: { id },
    data: {
      views: {
        increment: 1,
      },
    },
    include: {
      comments: {
        where: {
          parentId: null,
          status: CommentStatus.APPROVED,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          replies: {
            where: {
              status: CommentStatus.APPROVED,
            },
            orderBy: {
              createdAt: "asc",
            },
            include: {
              replies: {
                where: {
                  status: CommentStatus.APPROVED,
                },
                orderBy: {
                  createdAt: "asc",
                },
              },
            },
          },
        },
      },
      _count: {
        select: { comments: true },
      },
    },
  });
};

const getMyPosts = async (authorId: string) => {
  await prisma.user.findUniqueOrThrow({
    where: { id: authorId, status: "ACTIVE" },
  });

  return await prisma.post.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: { _count: { select: { comments: true } } },
  });
};

const createPost = async (
  userId: string,
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">
) => {
  return await prisma.post.create({ data: { ...data, authorId: userId } });
};

const updatePost = async (
  id: string,
  authorId: string,
  data: PostUpdateInput,
  isAdmin: boolean
) => {
  const postData = await prisma.post.findUniqueOrThrow({
    where: {
      id,
    },
    select: {
      id: true,
      authorId: true,
    },
  });

  if (!isAdmin && postData.authorId !== authorId) {
    throw new Error("You don't have permission to modify this post!");
  }

  if (!isAdmin) {
    delete data.isFeatured;
  }

  return await prisma.post.update({
    where: { id },
    data,
  });
};

const deletePost = async (id: string, authorId: string, isAdmin: boolean) => {
  console.log("postData");
  const postData = await prisma.post.findUniqueOrThrow({
    where: { id },
    select: { id: true, authorId: true },
  });

  if (!isAdmin && postData.authorId !== authorId) {
    throw new Error("You don't have permission to delete this post!");
  }

  return await prisma.post.delete({ where: { id } });
};

export const PostService = {
  createPost,
  getPosts,
  getPostById,
  getMyPosts,
  updatePost,
  deletePost,
};
