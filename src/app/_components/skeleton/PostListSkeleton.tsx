import { Skeleton } from "@nextui-org/react";

export default function PostListSkeleton() {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex max-w-[800px] justify-center">
          <div className="flex w-full items-center justify-between">
            <div className="w-full px-5 py-10">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Skeleton className="h-[25px] w-[25px] rounded-full light before:border-transparent before:from-transparent before:to-transparent after:content-none light:bg-[#0000000a] light:before:via-[#ececec85] dark:bg-[#ffffff0d] dark:before:via-[#3333333d]" />
                  <Skeleton className="h-3 w-16 light before:border-transparent before:from-transparent before:to-transparent after:content-none light:bg-[#0000000a] light:before:via-[#ececec85] dark:bg-[#ffffff0d] dark:before:via-[#3333333d]" />
                </div>
                <Skeleton className="mb-5 h-6 w-[calc(100%-250px)] light before:border-transparent before:from-transparent before:to-transparent after:content-none light:bg-[#0000000a] light:before:via-[#ececec85] dark:bg-[#ffffff0d] dark:before:via-[#3333333d] max-sm:w-full" />
              </div>

              <div>
                <Skeleton className="h-4 w-11 light before:border-transparent before:from-transparent before:to-transparent after:content-none light:bg-[#0000000a] light:before:via-[#ececec85] dark:bg-[#ffffff0d] dark:before:via-[#3333333d]" />
              </div>
            </div>
            <Skeleton className="h-[100px] w-[150px] light before:border-transparent before:from-transparent before:to-transparent after:content-none light:bg-[#0000000a] light:before:via-[#ececec85] dark:bg-[#ffffff0d] dark:before:via-[#3333333d] max-md:h-24 max-md:w-28 max-sm:h-20 max-sm:w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}
