import { ZodError, z } from "zod";
import type { JSONContent } from "@tiptap/react";

export const zodContentValidator = z.custom<JSONContent>(
  (val: JSONContent): JSONContent | ZodError => {
    const contentLength = val.content?.length;
    if (contentLength === 0) {
      throw new ZodError([
        { message: "Content can't be empty", code: "custom", path: [""] },
      ]);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (val.type == "doc") {
      return val;
    } else {
      throw new ZodError([
        {
          message: "Object type must be doc",
          code: "custom",
          path: [""],
        },
      ]);
    }
  },
);

export const addPostSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "max title lenght 100"),
  content: zodContentValidator,
  perviewSrc: z.string(),
});

export const addCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(1, "name cannot be empty")
    .max(30, "name cannot be longer than 30 characters"),
  description: z
    .string()
    .min(1, "description cannot be empty")
    .max(160, "description cannot be longer than 160 characters"),
  image: z.string().url("Invalid image url").min(1, "image cannot be empty"),
  subname: z
    .string()
    .min(1, "subname cannot be empty")
    .max(30, "subname cannot be longer than 160 characters"),
});
