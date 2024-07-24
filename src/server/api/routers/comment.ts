import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const commentRouter = createTRPCRouter({
  createComment: protectedProcedure
    .input(
      z.object({
        postID: z.number(),
        content: z
          .string()
          .min(1, "Comment cannot be empty")
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.db.comments.create({
        data: {
          author: { connect: { id: ctx.session.user.id } },
          content: input.content,
          post: { connect: { id: input.postID } },
        },
      });

      return comment;
    }),
  getCommentsByPostId: publicProcedure
    .input(
      z.object({
        postId: z.number({ message: "Post id must be positive number" }),
      }),
    )
    .query(async ({ ctx, input }) => {
      const comments = ctx.db.comments.findMany({
        where: {
          postId: input.postId,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          author: {
            select: {
              name: true,
              image: true,
            },
          },
          createdAt: true,
          content: true,
        },
      });

      return comments;
    }),
});
