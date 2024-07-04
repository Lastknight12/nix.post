import { Spinner } from "@nextui-org/react";
import { Suspense } from "react";
import Profile from "~/app/_components/profile/Profile";

interface Props {
  params: {
    subname: string;
  };
}

export default async function Prof(req: Props) {
  return (
    <Suspense
      fallback={
        <div className="flex h-[calc(100vh-116px)] w-full items-center justify-center">
          <Spinner color="default" size="lg" />
        </div>
      }
    >
      <Profile subName={decodeURIComponent(req.params.subname)} />
    </Suspense>
  );
}
