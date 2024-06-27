import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { supabaseServer } from "~/server/supabase/server";
import { randomName } from "~/utils/utils";
import { TRPCError } from "@trpc/server";

const imageType = z.enum(["postsImages", "postPerviewImages"]);

export const imagesRouter = createTRPCRouter({
  uploadImage: protectedProcedure
    .input(
      z.object({
        imageFile: z.object({
          file: z.string(),
          type: imageType,
        }),
      }),
    )
    .mutation(async ({ input }) => {
      if (!input.imageFile.file) {
        throw new TRPCError({
          message: "No image file provided",
          code: "BAD_REQUEST",
        });
      }
      const bucket = supabaseServer().storage.from("image");
      const fileName = randomName(11);

      const base64Data = input.imageFile.file.split(",")[1];
      const fileContent = Buffer.from(base64Data!, "base64");

      const file = await bucket.upload(
        `${input.imageFile.type}/${fileName}`,
        fileContent,
      );

      return file.data?.path;
    }),
});
