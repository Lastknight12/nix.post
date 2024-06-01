"use client";

import Post from "./Post";
import { api } from "~/trpc/react";
import { useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import PostListSkeleton from "../skeleton/PostListSkeleton";

export default function PostsList() {
  const ref = useRef(null);
  const isInView = useInView(ref);

  const { data, fetchNextPage, isPending } = api.post.getBatch.useInfiniteQuery(
    {
      limit: 9,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialCursor: undefined,
    },
  );

  useEffect(() => {
    if (isInView) {
      fetchNextPage()
        .then((data) => {
          return data;
        })
        .catch((error) => {
          console.error("error when getting posts:", error);
        });
    }
  }, [isInView, fetchNextPage]);

  return (
    <div className=" mt-3">
      {!isPending ? (
        data?.pages.map((page) =>
          page.items.map((post) => <Post post={post} key={post.id} />),
        )
      ) : (
        <div
          ref={ref}
          className="mx-auto mt-3 flex flex-col justify-center gap-1"
        >
          <PostListSkeleton />
        </div>
      )}
    </div>
  );
}
