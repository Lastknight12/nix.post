import SinglePost from "~/app/_components/singlePost/SinglePost";
import { Suspense } from "react";
import SinglePostSkeleton from "~/app/_components/skeleton/SinglePostSkeleton";

interface Props {
  params: {
    id: string;
  };
}

export default async function PostInfo(req: Props) {
  return (
    <>
      <Suspense fallback={<SinglePostSkeleton />}>
        <SinglePost postPublicId={req.params.id} />
      </Suspense>
    </>
  );
}
