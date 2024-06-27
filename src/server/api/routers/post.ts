import type { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { zodContentValidator } from "~/types/zodSchemas";
import { randomName } from "~/utils/utils";

export const postRouter = createTRPCRouter({
  createPost: protectedProcedure
    .input(
      z.object({
        title: z
          .string()
          .min(5, "Title must be at least 5 characters long")
          .max(100, "Title must be no more than 100 characters long"),
        content: zodContentValidator,
        tags: z.array(z.object({ id: z.number(), displayName: z.string() }), {
          required_error: "Tags are required",
        }),
        perviewSrc: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.tags.length > 5) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Too many tags",
        });
      }

      await Promise.all(
        input.tags.map(async (tag) => {
          if (!/^[a-zA-Z0-9\s-]+$/.test(tag.displayName)) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Invalid tag name",
            });
          }

          if (tag.displayName.length > 15) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Tag name must be no more than 15 characters long",
            });
          }

          const tagExist = await ctx.db.tags.findFirst({
            where: {
              displayName: tag.displayName,
            },
          });

          if (!tagExist) {
            await ctx.db.tags.create({
              data: {
                displayName: tag.displayName,
              },
            });
          }
        }),
      );

      await ctx.db.post.create({
        data: {
          title: input.title,
          publicId: randomName(11),
          content: input.content,
          perviewSrc: input.perviewSrc ?? null,
          createdBy: { connect: { id: ctx.session.user.id } },
          tags: {
            connect: input.tags.map((tag) => ({
              displayName: tag.displayName,
            })),
          },
        },
      });

      return {
        code: 200,
        message: "Successfully created post",
      };
    }),

  getPosts: publicProcedure
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
          createdAt: "desc",
        },
        select: {
          id: true,
          publicId: true,
          title: true,
          perviewSrc: true,
          createdAt: true,
          updatedAt: true,
          likes: true,
          tags: true,
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

  getLikesAndCommentsCount: publicProcedure
    .input(
      z.object({
        postId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const postStats = await ctx.db.post.findUnique({
        where: {
          id: input.postId,
        },
        select: {
          _count: {
            select: {
              comments: true,
            },
          },
          likes: true,
        },
      });

      return postStats;
    }),

  isPostLiked: publicProcedure
    .input(
      z.object({
        postId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userLikedPosts =
        ctx.session &&
        (await ctx.db.user.findUnique({
          where: {
            id: ctx.session?.user.id,
          },
          select: {
            likedPosts: true,
          },
        }));

      return userLikedPosts?.likedPosts.includes(input.postId) ?? false;
    }),

  getPostsByTag: publicProcedure
    .input(
      z.object({
        tagName: z.string().min(1, "Tag name cannot be empty"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const posts = await ctx.db.post.findMany({
        where: { tags: { some: { displayName: input.tagName } } },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          publicId: true,
          perviewSrc: true,
          title: true,
          createdAt: true,
          likes: true,
          tags: true,
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
        content: z.custom<Prisma.JsonValue>(),
        createdAt: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.post.update({
        where: { id: input.id },
        data: {
          title: input.title,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          content: JSON.parse(input.content as string),
          createdAt: input.createdAt,
        },
      });
    }),

  getIndividualPost: publicProcedure
    .input(
      z.object({ publicId: z.string().max(11).min(1, "post id is reqired") }),
    )
    .query(async ({ ctx, input }) => {
      if (!input.publicId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "post id is reqired",
        });
      }

      const post = await ctx.db.post.findUnique({
        where: {
          publicId: input.publicId,
        },
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          likes: true,
          tags: true,
          createdBy: {
            select: {
              name: true,
              image: true,
            },
          },
          comments: {
            select: {
              id: true,
              createdAt: true,
              content: true,
              author: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
      });

      if (!post) {
        return null;
      }

      return post;
    }),

  incrementLike: protectedProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const userLikedPosts = await ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          likedPosts: true,
        },
      });

      if (userLikedPosts?.likedPosts.includes(input.postId)) {
        throw new TRPCError({
          message: "You have already liked this post",
          code: "BAD_REQUEST",
        });
      }

      await Promise.all([
        ctx.db.post.update({
          where: {
            id: input.postId,
          },
          data: {
            likes: { increment: 1 },
          },
        }),
        ctx.db.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            likedPosts: { push: input.postId },
          },
        }),
      ]);
    }),

  getAllTags: publicProcedure
    .input(z.object({ startWith: z.string() }))
    .query(async ({ ctx, input }) => {
      const tags = await ctx.db.tags.findMany({
        where: {
          displayName: {
            startsWith: input.startWith,
          },
        },
        select: {
          id: true,
          displayName: true,
          _count: {
            select: {
              posts: true,
            },
          },
        },
      });

      return tags;
    }),
});
