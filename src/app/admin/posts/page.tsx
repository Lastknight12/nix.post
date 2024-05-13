"use client";

import { Button } from "@nextui-org/button";
import { api } from "~/trpc/react";

export default function Posts() {
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    api.post.getBatch.useInfiniteQuery(
      {
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialCursor: 1
      },
    );

  const handleFetchNextPage = () => {
    return fetchNextPage();
  };

  return (
    <div className="mt-6 overflow-x-auto">
      <Button
        onClick={handleFetchNextPage}
        isDisabled={!hasNextPage}
        className="mb-5"
      >
        {hasNextPage ? "Load More" : "No content to load"}
      </Button>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-transparent">
          <tr>
            <th className="border-r-1 border-[#ffffff40] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
              id
            </th>
            <th className="border-r-1 border-[#ffffff40] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
              title
            </th>
            <th className="border-r-1 border-[#ffffff40] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
              content
            </th>
            <th className="border-r-1 border-[#ffffff40] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
              createdAt
            </th>
            <th className="border-r-1 border-[#ffffff40] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
              updatedAt
            </th>
            <th className="border-r-1 border-[#ffffff40] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
              authorName
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-transparent">
          {data ? (
            data.pages.map((page) =>
              page.items.map((item) => {
                return (
                  <tr key={item.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-white">
                      {item.id}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-white">
                      {item.title}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-white">
                      {item.content}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-white">
                      {item.createdAt.toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-white">
                      {item.updatedAt.toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-white">
                      {item.createdBy.name}
                    </td>
                  </tr>
                );
              }),
            )
          ) : (
            <tr>
              <td
                className="whitespace-nowrap px-6 py-4 text-sm text-white"
                colSpan={2}
              >
                Loading...
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {isFetchingNextPage && "Loading..."}
    </div>
  );
}
