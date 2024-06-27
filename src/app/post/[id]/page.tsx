import SinglePost from "~/app/_components/singlePost/SinglePost";
import { Suspense } from "react";
import SinglePostSkeleton from "~/app/_components/skeleton/SinglePostSkeleton";
import NotFound from "~/app/not-found";

export default async function PostInfo(req: {
  params: {
    id: string;
  };
}) {
  return (
    <>
      <NotFound />
    </>
  );
}
