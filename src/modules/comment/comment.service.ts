import { CommentStatus } from "../../../generated/prisma/enums";
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

const deleteComment = async (id: string, userId: string) => {
  return await prisma.comment.delete({
    where: {
      id,
      userId,
    },
  });
};

const updateComment = async ({
  id,
  userId,
  content,
  status,
}: {
  id: string;
  userId: string;
  content: string;
  status: CommentStatus;
}) => {
  return await prisma.comment.update({
    where: {
      id,
      userId,
    },
    data: {
      content,
      status,
    },
  });
};

const updateCommentStatus = async (
  id: string,
  data: { status: CommentStatus }
) => {
  const commentData = await prisma.comment.findUniqueOrThrow({
    where: {
      id,
    },
    select: {
      status: true,
    },
  });

  if (commentData.status === data.status) {
    throw new Error("Comment status already " + data.status);
  }

  return await prisma.comment.update({
    where: {
      id,
    },
    data: { status: data.status },
  });
};

export const CommentService = {
  getCommentsByUser,
  createComment,
  deleteComment,
  updateComment,
  updateCommentStatus,
};
