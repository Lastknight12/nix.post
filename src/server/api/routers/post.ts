import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  createPost: protectedProcedure
    .input(z.object({ title: z.string().min(5), content: z.string().min(20) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.post.create({
        data: {
          title: input.title,
          content: input.content,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  createComment: protectedProcedure
    .input(z.object({ postID: z.number(), content: z.string().min(1).max(120) }))
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

  getBatch: publicProcedure
    .input(
      z.object({
        limit: z.number(),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;
      const items = await ctx.db.post.findMany({
        take: limit + 1,
        where: cursor ? { id: { lt: cursor + 1 } } : undefined,
        orderBy: {
          id: "desc"
        },
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          createdBy: {
            select: {
              name: true,
              image: true
            }
          },
        },
      });
      if(!items) {
        return {
          items: [],
          nextCursor: undefined
        }
      }
      let nextCursor: number | undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  getLastPosts: publicProcedure.query(async ({ ctx }) => {
    let count = await ctx.db.post.count();
    if (count <= 3) {
      count = 1;
    } else {
      count = count - 2;
    }
    const post = ctx.db.post.findMany({
      cursor: {
        id: count,
      },
      take: 3,
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
    });
    return post;
  }),

  getAllUsers: protectedProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.user.findMany();
    return users;
  }),

  getIndividualPost: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.post.findFirst({
        where: {
          id: input.id,
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
                  image: true,
                },
              },
            },
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
