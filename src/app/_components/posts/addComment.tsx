"use client";

import { Button } from "@nextui-org/button";
import { Textarea } from "@nextui-org/input";
import React, { useState } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface props {
  postId: string;
  post: {
    comments: {
      content: string;
      id: number;
      createdAt: Date;
      author: {
        name: string;
        image: string;
      };
    }[];
    title: string;
    content: string;
    createdBy: {
      name: string;
      image: string;
    };
  };
}

function formatDate(date: Date) {
    const now = new Date();
    const diff = now.getTime() - date.getTime(); // Difference in milliseconds
    const diffMinutes = Math.floor(diff / 60000);
  
    if (diffMinutes < 1) {
      return 'тільки що';
    } else if (diffMinutes < 60) {
      return `${diffMinutes} хвилин тому`;
    } else if (diffMinutes < 1440) {
      return `${Math.floor(diffMinutes / 60)} годин тому`;
    } else if (diffMinutes < 2880) {
      return 'вчора';
    } else if (diffMinutes < 10080) {
      return date.toLocaleString('uk-UA', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('uk-UA', { year: 'numeric', month: 'short', day: 'numeric' });
    }
  }

const Comments: React.FC<props> = ({ postId, post }: props) => {
  const router = useRouter();
  const [comment, setComment] = useState("");

  const createPost = api.post.createComment.useMutation({
    onSuccess: () => {
      setComment("");
      router.refresh();
    },
  });

  function handleClick() {
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
                  " bg-transparent text-white border-[#ffffff9e] hover:border-[#ffffff9e]",
              }}
              color="primary"
              variant="underlined"
            />
            <Button
              variant="shadow"
              color="success"
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
                  className=" flex flex-col rounded bg-[#80808080] p-4"
                >
                  <div className=" flex items-center gap-2">
                    <div>
                      <Image
                        alt="user picture"
                        src={comment.author.image}
                        width={48}
                        height={48}
                        className=" rounded-full"
                      />
                    </div>
                    <div className=" flex flex-col">
                      <h1 className=" text-[#ebe2d6]">{comment.author.name}</h1>
                      <pre className=" mb-1 text-wrap font-[inherit]">
                        {comment.content}
                      </pre>
                      <p className=" text-gray-400">
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
};

export default Comments;
