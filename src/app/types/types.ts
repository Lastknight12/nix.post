import { z } from "zod";

export const addPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(20, "content must be at least 20 characters").max(700, "max content length 700"),
});

export const addCommentSchema = z.object({
  content: z.string().min(1, "comment can't be null").max(120, "comment length 120"),
});