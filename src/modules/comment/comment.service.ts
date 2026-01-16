import { prisma } from "../../lib/prisma";

const getCommentsByUser = async (authorId: string) => {
  return await prisma.comment.findMany({
    where: {
      userId: authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
};

const createComment = async (payload: {
  content: string;
  postId: string;
  userId: string;
  parentId: string;
}) => {
  return await prisma.comment.create({ data: payload });
};

export const CommentService = {
  getCommentsByUser,
  createComment,
};
