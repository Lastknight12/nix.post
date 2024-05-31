"use client";

import Post from "./Post";
import { api } from "~/trpc/react";
import { useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { Card, Skeleton } from "@nextui-org/react";

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
          {Array.from({ length: 3 }).map((_, index) => (
            <Card
              key={index}
              className="w-full space-y-5 rounded-3xl bg-[#59595954] px-5 py-10 shadow-none"
            >
              <div className="mb-3 flex items-center gap-2">
                <Skeleton className="h-[50px] w-[50px] rounded-full bg-default-200" />
                <Skeleton className="h-5 w-24 rounded-lg bg-default-200" />
              </div>
              <div className="">
                <Skeleton className="mb-3 h-6 w-44 rounded-lg bg-default-200" />
                <Skeleton className="h-3 w-20 rounded-lg bg-default-200" />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
