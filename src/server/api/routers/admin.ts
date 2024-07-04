import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { zodContentValidator } from "~/types/zodSchemas";
import { adminProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const adminRouter = createTRPCRouter({
  getAllPosts: protectedProcedure.query(async ({ ctx }) => {
    const allPosts = await ctx.db.post.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        perviewSrc: true,
        createdAt: true,
        updatedAt: true,
        createdBy: {
          select: { name: true, subname: true },
        },
        tags: {
          select: {
            displayName: true,
          },
        },
        likes: true,
        _count: {
          select: { comments: true },
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

  updateSingleUser: adminProcedure
    .input(
      z.object({
        id: z.string().min(1, "ID cannot be empty"),
        name: z
          .string()
          .min(1, "Name cannot be empty")
          .max(30, "name cannot be longer than 30 characters"),
        subname: z
          .string()
          .min(1, "Subname cannot be empty")
          .max(30, "subname cannot be longer than 30 characters"),
        email: z.string().email("Invalid email address"),
        description: z
          .string()
          .min(1, "Description cannot be empty")
          .max(160, "Description cannot be longer than 160 characters"),
        image: z.string().url("Invalid URL"),
        role: z.optional(
          z.enum(["User", "Admin"], {
            message: "Invalid role. Should be USER or ADMIN",
          }),
        ),
        likedPosts: z.array(z.number()),
        emailVerified: z.date().nullish(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.user.update({
          where: { id: input.id },
          data: {
            name: input.name,
            email: input.email,
            image: input.image,
            subname: input.subname,
            description: input.description,
            role: input.role,
            likedPosts: input.likedPosts,
            emailVerified: input.emailVerified,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while updating user",
        });
      }
    }),

  updateSinglePost: adminProcedure
    .input(
      z.object({
        id: z.number().min(1, "ID must be a positive number"),
        title: z
          .string()
          .min(5, "Title must be at least 5 characters long")
          .max(100, "Title must be no more than 100 characters long"),
        content: zodContentValidator,
        perviewSrc: z.string().url("Invalid URL").nullish(),
        likes: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.post.update({
          where: { id: input.id },
          data: {
            title: input.title,
            content: input.content,
            perviewSrc: input.perviewSrc,
            likes: input.likes,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while updating post",
        });
      }
    }),
});
