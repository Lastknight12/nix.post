import { Link } from "@nextui-org/react";
import { api } from "~/trpc/server";
import type { Profile } from "~/types/types";
import Image from "next/image";
import { getServerAuthSession } from "~/server/auth";
import { UserDescription } from "~/app/_components/profile/user";

export default async function Profile(req: Profile) {
  const userName = req.params.name;

  const [user, posts] = await Promise.all([
    api.post.getUserInfo({ userName: userName }),
    api.post.getAllUserPosts({ userName: userName }),
  ]);
  const session = await getServerAuthSession();

  return (
    <div className=" flex text-black max-[800px]:flex-col-reverse max-[800px]:items-center">
      <div className=" grow-[1] max-[800px]:w-full">
        <h1 className=" mb-7 text-5xl font-bold light light:text-black dark:text-white max-[800px]:hidden">
          {req.params.name}
        </h1>
        <div className=" flex flex-col">
          {posts.map((post) => {
            return (
              <Link
                href={"/post/" + post.id}
                key={post.id}
                className=" flex w-full flex-col items-start border-b-1 border-[#808080a8] p-6 hover:bg-[#84838333] max-md:hover:bg-transparent"
              >
                <div className=" mb-2 gap-2">
                  <Image
                    src={post.createdBy.image}
                    alt="post creator avatar"
                    width={25}
                    height={25}
                    className=" rounded-full"
                  ></Image>
                  <p className=" text-lg font-medium light light:text-[#000] dark:text-[#ffffff]">
                    {post.createdBy.name}
                  </p>
                </div>
                <h1 className=" mb-3 text-3xl font-bold light light:text-black dark:text-white">
                  {post.title}
                </h1>
                <p className=" text-[#808080a8]">
                  {post.createdAt.toLocaleDateString()}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
      <div className=" grow-[2] p-7 max-[800px]:w-full">
        <UserDescription user={user} session={session} />
      </div>
    </div>
  );
}
