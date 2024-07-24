import { Link } from "@nextui-org/react";
import { api } from "~/trpc/server";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function Profile({ subName }: { subName: string }) {
  const [user, posts] = await Promise.all([
    api.user.getUserInfo({ subName }),
    api.user.getAllUserPosts({ subName }),
  ]);

  if (!user) {
    return notFound();
  }

  return (
    <div className="flex justify-between text-black max-[800px]:flex-col-reverse">
      <div className="grow-[1] max-[800px]:w-full min-[800px]:mr-20">
        <div className="flex flex-col">
          <p className="text-white">{!posts.length ? "User does not have any posts" : null}</p>
          {posts.map((post) => {
            // rebuild this
            return (
              <Link
                href={`/post/${post.publicId}`}
                key={post.id}
                className="flex w-full flex-col items-start border-b-1 border-[#808080a8] py-6 hover:bg-[#84838333] max-md:hover:bg-transparent"
              >
                <div className="flex w-full items-center justify-between px-[8px] max-[800px]:px-[0]">
                  <div className="mr-6">
                    <div className="mb-2 flex items-center gap-2">
                      <div
                        style={{
                          backgroundImage: `url${post.createdBy.image}`
                        }}
                        className="rounded-full w-[25px] h-[25px] bg-cover bg-center bg-no-repeat"
                      />
                      <p className="text-md font-medium light light:text-[#000] dark:text-[#ffffff]">
                        {post.createdBy.name}
                      </p>
                    </div>
                    <h1 className="mb-3 max-w-[600px] break-words font-comfortaa text-xl light light:text-black dark:text-white">
                      {post.title}
                    </h1>
                    <p className="text-[#808080a8]">
                      {post.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    {post.perviewSrc && (
                      <Image
                        src={post.perviewSrc}
                        alt="user avatar"
                        width={120}
                        height={80}
                        className="max-h-[125px] max-w-max rounded object-fill"
                      />
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="max-w-[400px] grow-[1] light max-[800px]:w-full max-[800px]:max-w-full max-[800px]:border-b-1 max-[800px]:pb-7 max-[800px]:light:border-[#e3e3e3a8] max-[800px]:dark:border-[#242424a8]">
        <div className="sticky top-20">
          <div
            style={{
              backgroundImage: `url(${user.image})`
            }}
            className="mb-2 rounded-full w-[65px] h-[65px] bg-cover bg-center bg-no-repeat"
          />
          <h1 className="text-xl font-semibold dark:text-white">{user.name}</h1>
          <h1 className="mb-3 text-[13px] font-semibold text-[#7c7c7c]">
            {user.subname}
          </h1>

          <p className="font-comfortaa text-xl dark:text-white">
            {user.description}
          </p>
        </div>
      </div>
    </div>
  );
}
