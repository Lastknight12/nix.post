import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { zodContentValidator } from "~/types/zodSchemas";

export const adminRouter = createTRPCRouter({
  getAllPosts: protectedProcedure.query(async ({ ctx }) => {
    const allPosts = await ctx.db.post.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        createdBy: {
          select: { name: true },
        },
      },
    });
    return allPosts;
  }),

  getAllUsers: protectedProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.user.findMany();
    return users;
  }),

  getLastPosts: protectedProcedure.query(async ({ ctx }) => {
    const count = await ctx.db.post.count();
    const post = ctx.db.post.findMany({
      cursor: {
        id: count <= 3 ? 1 : count - 2,
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
        content: zodContentValidator,
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
});
