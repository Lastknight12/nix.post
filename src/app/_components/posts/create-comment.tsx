"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

export function CreateComment() {
  const router = useRouter();
  const [comment, setComment] = useState("");

  const createComment = api.post.createComment.useMutation({
    onSuccess: () => {
      router.refresh();
      setComment("");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createComment.mutate({ comment });
      }}
      className="flex flex-col gap-2"
    >
      <input
        type="text"
        placeholder="Title"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={createComment.isPending}
      >
        {createComment.isPending ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
