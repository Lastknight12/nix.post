import { api } from "~/trpc/server";
import Post from "./post";

{
  /* #TODO створити окремий екземпляр тодо */
}

interface post {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  createdBy: {
    name: string;
    image: string;
  };
}

function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  } else {
    return str.slice(0, maxLength) + "....";
  }
}

export default async function Posts() {
  const latestPost = await api.post.getLatest();

  return (
    <main className="z-10 my-4 flex w-full max-w-full justify-center">
      <div className="max-w-[1024px] p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {latestPost.length !== 0 ? (
            latestPost.map((post: post, _index: number) => {
              post.content = truncateString(post.content, 200);
              return <Post post={post} key={post.id}></Post>;
            })
          ) : (
            <div className="text-white">You have no posts yet.</div>
          )}
        </div>
      </div>
    </main>
  );
}
