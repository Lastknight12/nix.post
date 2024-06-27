"use client";

// next ui / components
import { Button } from "@nextui-org/button";
import Image from "next/image";

// hooks and etc...
import { useState } from "react";

// trpc api caller
import { api } from "~/trpc/react";

// toast
import toast from "react-hot-toast";

// types / Schemas
import { addCommentSchema } from "~/types/zodSchemas";
import { ZodError } from "zod";

// utils
import { formatDate } from "~/utils/utils";

export interface CommentProps {
  postId: number;
}
export default function Comments({ postId }: CommentProps) {
  const [comment, setComment] = useState("");

  const utils = api.useUtils();
  const createPost = api.comment.createComment.useMutation({
    onSuccess: async () => {
      await utils.comment.getCommentsByPostId.invalidate({ postId: postId });
      setComment("");
    },
  });

  const { data: comments } = api.comment.getCommentsByPostId.useQuery({
    postId: postId,
  });

  function handleClick() {
    try {
      addCommentSchema.parse({ content: comment });
    } catch (error) {
      if (error instanceof ZodError) {
        toast.error(error.errors[0]!.message);
      }
    }
    createPost.mutate({ postID: postId, content: comment });
  }

  return (
    <>
      <div className="mb-10 px-4">
        <div className="mx-auto max-w-[1024px]">
          <div className="mb-4 flex flex-col items-end gap-4">
            <textarea
              onChange={(e) => setComment(e.target.value)}
              value={comment}
              placeholder="Write a comment"
              className="h-[calc(50vh-100px)] w-full resize-none rounded bg-[#202020] p-4 text-white focus:outline-none dark:bg-[#2a2a2a] dark:text-white"
            />
            <Button
              variant="shadow"
              color="primary"
              isLoading={createPost.isPending}
              onClick={() => handleClick()}
            >
              Comment
            </Button>
          </div>
          <div className="mt-5 flex w-full flex-col justify-center gap-5">
            {comments ? (
              comments.map((comment) => {
                return (
                  <div
                    key={comment.id}
                    className="flex flex-col rounded bg-[#202020] p-4"
                  >
                    <div>
                      <div className="mb-3 flex items-center gap-2">
                        <Image
                          alt="user picture"
                          src={comment.author.image}
                          width={45}
                          height={45}
                          className="rounded-full"
                        />
                        <div className="flex flex-col">
                          <h1 className="font-montserrat text-[#ebe2d6]">
                            {comment.author.name}
                          </h1>
                          <p className="font-montserrat text-gray-400">
                            {formatDate(comment.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <pre className="mb-1 text-wrap break-words font-[inherit] text-white">
                          {comment.content}
                        </pre>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div>Failed to load comment</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
