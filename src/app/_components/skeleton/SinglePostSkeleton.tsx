import { Card, Skeleton } from "@nextui-org/react";

export default function SinglePostSkeleton() {
  return (
    <Card className="w-full space-y-5 rounded-3xl bg-transparent px-5 py-10 shadow-none">
      <div className=" mb-3 flex items-center gap-2">
        <Skeleton className="h-[50px] w-[50px] rounded-full light light:bg-[#0000000d] dark:bg-[#27272a4d] before:from-transparent light:before:via-[#a9a9a985] dark:before:via-[#e4e4e71a] before:to-transparent before:border-transparent after:content-none" />
        <Skeleton className="h-5 w-24 rounded-lg light light:bg-[#0000000d] dark:bg-[#27272a4d] before:from-transparent light:before:via-[#a9a9a985] dark:before:via-[#e4e4e71a] before:to-transparent before:border-transparent after:content-none" />
      </div>
      <div className="mb-2 max-w-screen-lg p-4 pb-10 ">
        <Skeleton className=" mx-auto mb-5 h-8 w-44 rounded-3xl light light:bg-[#0000000d] dark:bg-[#27272a4d] before:from-transparent light:before:via-[#a9a9a985] dark:before:via-[#e4e4e71a] before:to-transparent before:border-transparent after:content-none" />
        <div className=" max-w-[1024px]">
          <Skeleton className=" h-96 w-full rounded-3xl light light:bg-[#0000000d] dark:bg-[#27272a4d] before:from-transparent light:before:via-[#a9a9a985] dark:before:via-[#e4e4e71a] before:to-transparent before:border-transparent after:content-none" />
        </div>
      </div>
    </Card>
  );
}
