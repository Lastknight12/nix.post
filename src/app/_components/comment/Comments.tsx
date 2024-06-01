"use client";

import { Button } from "@nextui-org/button";
import { Textarea } from "@nextui-org/input";
import React, { useState } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { type Comment, addCommentSchema } from "~/types/types";
import { ZodError } from "zod";

function formatDate(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diff / 60000);

  if (diffMinutes < 1) {
    return "now";
  } else if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  } else if (diffMinutes < 1440) {
    return `${Math.floor(diffMinutes / 60)} hours ago`;
  } else if (diffMinutes < 2880) {
    return "yesterday";
  } else if (diffMinutes < 10080) {
    return date.toLocaleString("en-US", { weekday: "short" });
  } else {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
}

export default function Comments({ postId, post }: Comment) {
  const router = useRouter();
  const [comment, setComment] = useState("");

  const createPost = api.post.createComment.useMutation({
    onSuccess: () => {
      setComment("");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message)
    }
  });

  function handleClick() {
    try {
      addCommentSchema.parse({ content: comment });
    } catch (error) {
      if (error instanceof ZodError) {
        toast.error(error.errors[0]!.message);
      } else {
        throw new Error(String(error));
      }
    }
    createPost.mutate({ postID: postId, content: comment });
  }

  return (
    <>
      <div className="mb-10 px-4">
        <div className=" mx-auto max-w-[1024px]">
          <div className=" mb-4 flex items-center justify-center gap-4">
            <Textarea
              placeholder="Enter your comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              classNames={{
                inputWrapper:
                  " bg-transparent text-white dark:border-[#646464] light light:border-[#000] light:hover:border-[#000] dark:hover:border-[#646464]",
              }}
              color="secondary"
              variant="underlined"
            />
            <Button
              variant="shadow"
              color="success"
              isLoading={createPost.isPending}
              onClick={() => handleClick()}
            >
              Comment
            </Button>
          </div>
          <div className=" mt-5 flex w-full max-w-[400px] flex-col justify-center gap-5 max-md:mx-auto">
            {post.comments.map((comment) => {
              return (
                <div
                  key={comment.id}
                  className=" flex flex-col rounded bg-[#202020] p-4"
                >
                  <div className=" flex items-center gap-2">
                    <div>
                      <Image
                        alt="user picture"
                        src={comment.author.image}
                        width={65}
                        height={65}
                        className=" rounded-full"
                      />
                    </div>
                    <div className=" flex flex-col">
                      <h1 className=" font-montserrat text-[#ebe2d6]">
                        {comment.author.name}
                      </h1>
                      <pre className=" mb-1 text-wrap font-[inherit]">
                        {comment.content}
                      </pre>
                      <p className=" font-montserrat text-gray-400">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
