import { Card, Skeleton } from "@nextui-org/react";

export default function SinglePostSkeleton () {
    return (
        <Card className="w-full space-y-5 rounded-3xl px-5 py-10 ">
          <div className=" mb-3 flex items-center gap-2">
            <Skeleton className="h-[50px] w-[50px] rounded-full bg-default-200" />
            <Skeleton className="h-5 w-24 rounded-lg bg-default-200" />
          </div>
          <div className="mb-2 max-w-screen-lg p-4 pb-10 ">
            <Skeleton className=" mx-auto mb-5 h-8 w-44 rounded-3xl" />
            <div className=" max-w-[1024px]">
              <Skeleton className=" h-96 w-full rounded-3xl" />
            </div>
          </div>
        </Card>
    )
}