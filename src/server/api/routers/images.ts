import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { supabaseServer } from "~/server/supabase/server";

export const imagesRouter = createTRPCRouter({
  uploadImage: protectedProcedure
    .input(
      z.object({
        imageFile: z.object({
          name: z.string(),
          file: z.string(),
        }),
      }),
    )
    .mutation(async ({ input }) => {
      const bucket = supabaseServer().storage.from("image");

      const base64Data = input.imageFile.file.split(",")[1];
      const fileContent = Buffer.from(base64Data!, "base64");
      const file = await bucket.upload(input.imageFile.name, fileContent);

      return file.data?.path
    }),
});
