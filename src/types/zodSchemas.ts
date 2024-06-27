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
    if (typeof val === "object" && val.type == "doc") {
      return val;
    } else {
      throw new ZodError([
        {
          message: "Invalid content type",
          code: "custom",
          path: [],
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
