import { Card, Skeleton } from "@nextui-org/react";

export default function PostListSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <Card
          key={index}
          className="w-full space-y-5 rounded-3xl bg-transparent px-5 py-10 shadow-none"
        >
          <div className="mb-3 flex items-center gap-2">
            <Skeleton className="h-[50px] w-[50px] rounded-full light light:bg-[#0000000a] dark:bg-[#27272a4d] before:from-transparent light:before:via-[#a9a9a985] dark:before:via-[#e4e4e71a] before:to-transparent before:border-transparent after:content-none" />
            <Skeleton className="h-5 w-24 rounded-lg light light:bg-[#0000000a] dark:bg-[#27272a4d] before:from-transparent light:before:via-[#a9a9a985] dark:before:via-[#e4e4e71a] before:to-transparent before:border-transparent after:content-none" />
          </div>
          <div className="">
            <Skeleton className="mb-3 h-6 w-44 rounded-lg light light:bg-[#0000000a] dark:bg-[#27272a4d] before:from-transparent light:before:via-[#a9a9a985] dark:before:via-[#e4e4e71a] before:to-transparent before:border-transparent after:content-none" />
            <Skeleton className="h-3 w-20 rounded-lg light light:bg-[#0000000a] dark:bg-[#27272a4d] before:from-transparent light:before:via-[#a9a9a985] dark:before:via-[#e4e4e71a] before:to-transparent before:border-transparent after:content-none" />
          </div>
        </Card>
      ))}
    </>
  );
}
