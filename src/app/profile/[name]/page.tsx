import { Link } from "@nextui-org/react";
import { api } from "~/trpc/server";
import Image from "next/image";
import { getServerAuthSession } from "~/server/auth";
import { UserDescription } from "~/app/_components/profile/user";

interface Props {
  params: {
    name: string;
  };
}

export default async function Profile(req: Props) {
  const userName = req.params.name;
  const session = await getServerAuthSession();

  const [user, posts] = await Promise.all([
    api.post.getUserInfo({ userName }),
    api.post.getAllUserPosts({ userName }),
  ]);

  return (
    <div className="flex text-black max-[800px]:flex-col-reverse max-[800px]:items-center">
      <div className="grow-[1] max-[800px]:w-full">
        <h1 className="mb-7 text-2xl font-bold light light:text-black dark:text-white max-[800px]:hidden">
          {req.params.name}
        </h1>
        <div className="flex flex-col">
          {posts.map((post) => {
            return (
              <Link
                href={`/post/${post.publicId}`}
                key={post.id}
                className="flex w-full flex-col items-start border-b-1 border-[#808080a8] p-6 hover:bg-[#84838333] max-md:hover:bg-transparent"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Image
                    src={post.createdBy.image}
                    alt="post creator avatar"
                    width={25}
                    height={25}
                    className="rounded-full"
                  />
                  <p className="text-lg font-medium light light:text-[#000] dark:text-[#ffffff]">
                    {post.createdBy.name}
                  </p>
                </div>
                <h1 className="mb-3 font-comfortaa text-3xl light light:text-black dark:text-white">
                  {post.title}
                </h1>
                <p className="text-[#808080a8]">
                  {post.createdAt.toLocaleDateString()}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="grow-[] p-7 max-[800px]:w-full">
        <UserDescription user={user} session={session} />
      </div>
    </div>
  );
}
