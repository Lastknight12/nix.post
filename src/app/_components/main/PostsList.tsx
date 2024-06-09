"use client";

import Post from "./Post";
import { api } from "~/trpc/react";
import { useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import PostListSkeleton from "../skeleton/PostListSkeleton";
import { Spinner } from "@nextui-org/react";
import { showError } from "~/utils/utils";

export default function PostsList() {

  const { data, fetchNextPage, isPending, hasNextPage } =
    api.post.getBatch.useInfiniteQuery(
      {
        limit: 17,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialCursor: undefined,
      },
    );

  return (
    <div className="mt-3">
      {data ? (
        data?.pages.map((page) =>
          page.items.map((post) => {
            console.log(page.items)
            return (
              <Post
                post={post}
                key={post.id}
                postsLength={page.items[page.items.length - 10]!.id} // replace this idk how
                fetchNextFn={fetchNextPage}
              />
            );
          }),
        )
      ) : (
        <PostListSkeleton />
      )}
      <div
        className={
          data && hasNextPage
            ? "mt-2 flex w-full flex-col items-center gap-2"
            : "hidden"
        }
      >
        <Spinner color="secondary" label="Loading..." />
      </div>
    </div>
  );
}
