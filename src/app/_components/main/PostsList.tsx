"use client";

import Post from "./Post";
import { api } from "~/trpc/react";
import { useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import PostListSkeleton from "../skeleton/PostListSkeleton";
import { Spinner } from "@nextui-org/react";

export default function PostsList() {
  const ref = useRef(null);
  const isInView = useInView(ref);

  const { data, fetchNextPage, isPending, hasNextPage } =
    api.post.getBatch.useInfiniteQuery(
      {
        limit: 9,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialCursor: undefined,
      },
    );
  // is it logical to useEffect here, if isInView is a state and the component will still be rendered and check the condition without useEffect??
  useEffect(() => {
    if (isInView && !isPending) {
      fetchNextPage().catch((error) => {
        console.error("error when getting posts:", error);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView]);

  return (
    <div className=" mt-3">
      {data ? (
        data?.pages.map((page) =>
          page.items.map((post) => <Post post={post} key={post.id} />),
        )
      ) : (
        <PostListSkeleton />
      )}
      <div
        ref={ref}
        className={
          data && hasNextPage
            ? "mt-2 flex w-full flex-col items-center gap-2"
            : "hidden"
        }
      >
        <Spinner color="secondary" />
        <p className=" light light:text-black dark:text-white">Loading...</p>
      </div>
    </div>
  );
}
