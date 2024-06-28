import SinglePost from "~/app/_components/post/SinglePost";
import { Suspense } from "react";
import SinglePostSkeleton from "~/app/_components/skeletons/SinglePostSkeleton";

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
