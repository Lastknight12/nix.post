import { Skeleton } from "@nextui-org/react";

export default function SinglePostSkeleton() {
  return (
    <div className="mt-2 max-w-[1080px] text-black">
      <div className="mb-6">
        <Skeleton className="h-7 w-[400px] rounded-md light before:border-transparent before:from-transparent before:to-transparent after:content-none light:bg-[#0000000a] light:before:via-[#ececec85] dark:bg-[#ffffff0d] dark:before:via-[#3333333d]" />
      </div>

      <div>
        <div className="flex items-center gap-3">
          <div>
            <Skeleton className="h-10 w-10 rounded-full light before:border-transparent before:from-transparent before:to-transparent after:content-none light:bg-[#0000000a] light:before:via-[#ececec85] dark:bg-[#ffffff0d] dark:before:via-[#3333333d]" />
          </div>

          <div>
            <Skeleton className="mb-2 h-4 w-24 light before:border-transparent before:from-transparent before:to-transparent after:content-none light:bg-[#0000000a] light:before:via-[#ececec85] dark:bg-[#ffffff0d] dark:before:via-[#3333333d]" />

            <Skeleton className="h-4 w-24 light before:border-transparent before:from-transparent before:to-transparent after:content-none light:bg-[#0000000a] light:before:via-[#ececec85] dark:bg-[#ffffff0d] dark:before:via-[#3333333d]" />
          </div>
        </div>
      </div>

      <div className="mt-11 py-3 text-xs">
        <div className="flex gap-5">
          <Skeleton className="h-6 w-32 light before:border-transparent before:from-transparent before:to-transparent after:content-none light:bg-[#0000000a] light:before:via-[#ececec85] dark:bg-[#ffffff0d] dark:before:via-[#3333333d]" />
        </div>
      </div>

      <div className="mt-10">
        <Skeleton className="h-96 w-full rounded-xl light before:border-transparent before:from-transparent before:to-transparent after:content-none light:bg-[#0000000a] light:before:via-[#ececec85] dark:bg-[#ffffff0d] dark:before:via-[#3333333d]" />
      </div>
    </div>
  );
}
