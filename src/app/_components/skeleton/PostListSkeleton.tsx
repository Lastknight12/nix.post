import { Card, Skeleton } from "@nextui-org/react";

export default function PostListSkeleton() {
  return (
    <>
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
    </>
  );
}
