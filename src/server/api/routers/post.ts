import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  createPost: protectedProcedure
    .input(
      z.object({
        title: z
          .string()
          .min(5, "Title must be at least 5 characters long")
          .max(20, "Title must be no more than 20 characters long"),
        content: z.any(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.post.create({
        data: {
          title: input.title,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          content: input.content,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  createComment: protectedProcedure
    .input(
      z.object({
        postID: z.number(),
        content: z
          .string()
          .min(1, "Comment cannot be empty")
          .max(120, "Comment must be no more than 120 characters long"),
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

  getBatch: publicProcedure
    .input(
      z.object({
        limit: z
          .number()
          .min(1, "Limit must be at least 1")
          .max(100, "Limit must be no more than 100"),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;
      const items = await ctx.db.post.findMany({
        take: limit + 1,
        where: cursor ? { id: { lt: cursor + 1 } } : undefined,
        orderBy: {
          id: "desc",
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
              image: true,
            },
          },
        },
      });

      if (!items) {
        return {
          items: [],
          nextCursor: undefined,
        };
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

  getAllPosts: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany();
    return posts;
  }),

  getAllUserPosts: publicProcedure
    .input(
      z.object({
        userName: z.string().min(1, "User name cannot be empty"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const posts = await ctx.db.post.findMany({
        where: { createdBy: { name: input.userName } },
        orderBy: {
          id: "desc",
        },
        select: {
          id: true,
          title: true,
          createdAt: true,
          createdBy: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });
      return posts;
    }),

  getUserInfo: publicProcedure
    .input(
      z.object({ userName: z.string().min(1, "User name cannot be empty") }),
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          name: input.userName,
        },
        select: {
          id: true,
          name: true,
          image: true,
          description: true,
        },
      });

      return user;
    }),

  updateUserDescription: publicProcedure
    .input(
      z.object({
        userId: z.string().min(1, "User ID cannot be empty"),
        description: z.string().min(1, "Description cannot be empty"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.update({
        where: {
          id: input.userId,
        },
        data: {
          description: input.description,
        },
      });

      return "Successfully updated description";
    }),

  updateSingleUser: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, "ID cannot be empty"),
        name: z.string().min(1, "Name cannot be empty"),
        email: z.string().email("Invalid email address"),
        image: z.string().url("Invalid URL"),
        role: z.string().min(1, "Role cannot be empty"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.update({
        where: { id: input.id },
        data: {
          name: input.name,
          email: input.email,
          image: input.image,
        },
      });
    }),

  updateSinglePost: protectedProcedure
    .input(
      z.object({
        id: z.number().min(1, "ID must be a positive number"),
        title: z
          .string()
          .min(5, "Title must be at least 5 characters long")
          .max(20, "Title must be no more than 20 characters long"),
        content: z.any(),
        createdAt: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.post.update({
        where: { id: input.id },
        data: {
          title: input.title,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          content: input.content,
          createdAt: input.createdAt,
        },
      });
    }),

  getIndividualPost: publicProcedure
    .input(z.object({ id: z.number().min(1, "ID must be a positive number") }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.post.findFirst({
        where: {
          id: input.id,
        },
        select: {
          id: true,
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
