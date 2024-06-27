import Tiptap from "~/app/_components/createPost/Tiptap";
import { getServerAuthSession } from "~/server/auth";

export default async function CreatePost() {
  const session = await getServerAuthSession();

  if (!session) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="light:text-defaultLight dark:text-defaultDark text-2xl font-medium light">
          Login to create posts
        </div>
      </div>
    );
  }
  return <Tiptap />;
}
