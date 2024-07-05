"use client";

import Post from "./_components/postsList/Post";
import { api } from "~/trpc/react";
import { useEffect } from "react";
import PostListSkeleton from "./_components/skeletons/PostListSkeleton";
import { showError } from "~/utils/utils";
import { useSearchParams } from "next/navigation";

export default function PostsList() {
  const nextAuthError = useSearchParams().get("error");

  useEffect(() => {
    if (nextAuthError === "OAuthAccountNotLinked") {
      showError("Account with email already exists.");
    }
  }, [nextAuthError]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchNextPageError,
    isError,
    error,
  } = api.post.getPosts.useInfiniteQuery(
    {
      limit: 17,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialCursor: undefined,
    },
  );

  useEffect(() => {
    if (isFetchNextPageError) {
      showError("Error when fetching next posts");
    } else if (isError) {
      showError(error.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetchNextPageError, isError]);

  return (
    <>
      {data ? (
        data?.pages.map((page) =>
          page.items.map((post) => {
            return (
              <Post
                key={post.id}
                post={post}
                fetchNextPage={fetchNextPage}
                fetchNextTargetId={
                  hasNextPage && page.items[page.items.length - 8]?.id
                    ? page.items[page.items.length - 8]!.id
                    : undefined
                }
              />
            );
          }),
        )
      ) : (
        <PostListSkeleton />
      )}
    </>
  );
}
