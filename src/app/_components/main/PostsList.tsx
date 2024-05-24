"use client";

import Post from "./Post";
import { api } from "~/trpc/react";
import { useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { Spinner } from "@nextui-org/spinner";

export default function PostsList() {
  const ref = useRef(null);
  const isInView = useInView(ref);

  const { data, fetchNextPage, isFetched, isFetching } =
    api.post.getBatch.useInfiniteQuery(
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
      {isFetched &&
        data?.pages.map((page) =>
          page.items.map((post) => <Post post={post} key={post.id} />),
        )}
      <div ref={ref} className="mx-auto mt-3 flex justify-center">
        {isFetching && <Spinner color="secondary" />}
      </div>
    </div>
  );
}
