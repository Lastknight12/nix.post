import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  getUserInfo: publicProcedure
    .input(
      z.object({ subName: z.string().min(1, "User name cannot be empty") }),
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          subname: input.subName,
        },
        select: {
          id: true,
          name: true,
          subname: true,
          image: true,
          description: true,
        },
      });

      return user;
    }),
  getAllUserPosts: publicProcedure
    .input(
      z.object({
        subName: z.string().min(1, "User name cannot be empty"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const posts = await ctx.db.post.findMany({
        where: { createdBy: { subname: input.subName } },
        orderBy: {
          id: "desc",
        },
        select: {
          id: true,
          publicId: true,
          title: true,
          likes: true,
          perviewSrc: true,
          tags: true,
          createdAt: true,
          createdBy: {
            select: {
              name: true,
              subname: true,
              image: true,
            },
          },
        },
      });
      return posts;
    }),

  getUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        subname: true,
        image: true,
        description: true,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "User not found",
      });
    }

    return user;
  }),

  updateUser: protectedProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(1, "Name cannot be empty")
          .max(30, "name cannot be longer than 30 characters"),
        subname: z
          .string()
          .min(1, "subname cannot be empty")
          .max(30, "subname cannot be longer than 30 characters"),
        image: z
          .string()
          .url("Image must be a valid URL")
          .min(1, "Image cannot be empty"),
        description: z
          .string()
          .min(1, "Description cannot be empty")
          .max(160, "Description cannot be longer than 160 characters"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await ctx.db.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            name: input.name,
            subname: "@" + input.subname,
            image: input.image,
            description: input.description,
          },
        });
        return user;
      } catch (error) {
        if (error.code === 'P2002' && error.meta.target.includes('subname')) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Subname already taken!",
          });
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update user sttings! Try again later",
          });
        }
    }
});
