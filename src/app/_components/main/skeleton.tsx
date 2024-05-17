"use client";

import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Skeleton } from "@nextui-org/skeleton";
import Post from "./post";
import { api } from "~/trpc/react";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function SkeletonTemplate() {
  const ref = useRef(null);
  const isInView = useInView(ref);

  const { data, fetchNextPage, hasNextPage, isFetched, isFetchingNextPage } =
    api.post.getBatch.useInfiniteQuery(
      {
        limit: 6,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialCursor: undefined,
      },
    );

  if (isInView && hasNextPage) {
    fetchNextPage();
  }

  return (
    <>
      <div className="max-w-screen-lg p-6">
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {isFetched ? (
            data?.pages.map((posts) =>
              posts.items.map((post) => {
                return <Post post={post} key={post.id}></Post>;
              }),
            )
          ) : (
            <>
              {[...Array(9).keys()].map((index) => (
                <Card
                  key={index}
                  className="h-[220px] w-[300px] bg-[#85858532]"
                >
                  <CardHeader className="flex">
                    <Skeleton
                      isLoaded={isFetched}
                      className="text-md h-[25px] w-[100px] rounded-3xl !bg-[#85858545] text-[#ffffffc2]"
                    />
                  </CardHeader>
                  <CardBody className="py-0">
                    <Skeleton
                      isLoaded={isFetched}
                      className="mb-2 h-[15px] w-[240px] rounded-3xl !bg-[#85858523] text-gray-400"
                    />
                    <Skeleton
                      isLoaded={isFetched}
                      className="mb-2 h-[15px] w-[210px] rounded-3xl !bg-[#85858523] text-gray-400"
                    />
                    <Skeleton
                      isLoaded={isFetched}
                      className="mb-2 h-[15px] w-[230px] rounded-3xl !bg-[#85858523] text-gray-400"
                    />
                    <Skeleton
                      isLoaded={isFetched}
                      className="mb-2 h-[15px] w-[230px] rounded-3xl !bg-[#85858523] text-gray-400"
                    />
                  </CardBody>
                  <CardFooter>
                    <Skeleton className="rounded-3xl !bg-[#85858523] text-blue-500">
                      Read More
                    </Skeleton>
                  </CardFooter>
                </Card>
              ))}
            </>
          )}
        </div>
        <div ref={ref} className="text-white">
          {isFetchingNextPage && hasNextPage && "Loading..."}
        </div> 
      </div>
    </>
  );
}
