import SinglePost from "~/app/_components/singlePost/SinglePost";
import { Suspense } from "react";
import SinglePostSkeleton from "~/app/_components/skeleton/SinglePostSkeleton";

export default async function PostInfo(req: {
  params: {
    id: string;
  };
}) {
  return (
    <>
      <Suspense fallback={<SinglePostSkeleton />}>
        <SinglePost postId={req.params.id}></SinglePost>
      </Suspense>
    </>
  );
}
