import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  createPost: protectedProcedure
    .input(z.object({ title: z.string().min(5), content: z.string().min(20) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.post.create({
        data: {
          title: input.title,
          content: input.content,
          createdBy: {connect: {id: ctx.session.user.id}},
        },
      });
    }),

  createComment: protectedProcedure
    .input(z.object({ postID: z.string(), content: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.db.comments.create({
        data: {
          author: {connect: {id: ctx.session.user.id}},
          content: input.content,
          post: {connect: {id: input.postID}}
        }
      })
      return comment
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.post.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        createdBy: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });
    return post;
  }),

  getIndividualPost: publicProcedure
  .input(z.object({id: z.string()}))
  .query(async ({ctx, input}) => {
    const post = await ctx.db.post.findFirst({
      where: {
        id: input.id
      },
      select: {
        title: true,
        content: true,
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            author: {
              select: {
                name: true,
                image: true
              }
            }
          }
        },
        createdBy: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });
    return post;
  }),
});
