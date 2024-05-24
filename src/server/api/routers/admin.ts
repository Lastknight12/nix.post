import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

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
});
