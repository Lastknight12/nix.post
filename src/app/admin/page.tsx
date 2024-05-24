import { RiEditLine } from "react-icons/ri";
import { FaUserAlt } from "react-icons/fa";
import { db } from "~/server/db";
import { api } from "~/trpc/server";
import Link from "next/link";

export default async function Dashboard() {
  const [postCount, usersCount, lastPost] = await Promise.all([
    db.post.count(),
    db.user.count(),
    api.admin.getLastPosts(),
  ]);
  return (
    <div className="flex-grow-[9] rounded-md">
      <div className="mb-5">
        <h1 className="mb-1 text-2xl">Dashboard</h1>
        <p className="text-white">Home / Dashboard</p>
      </div>

      <div className="mb-5 flex gap-5">
        <Link href="/admin/posts">
          <div className="flex items-center gap-8 rounded-lg bg-[#0984ff0f] p-4 transition-colors hover:bg-[#0984ff26]">
            <div>
              <h1 className="text-lg font-medium">Posts</h1>
              <p className="text-3xl text-blue-700">{postCount}</p>
            </div>
            <div className="mr-3">
              <RiEditLine color="#395eff" size={40} />
            </div>
          </div>
        </Link>

        <Link href="/admin/users">
          <div className="flex items-center gap-8 rounded-lg bg-[#0984ff0f] p-4 transition-colors hover:bg-[#0984ff26]">
            <div>
              <h1 className="text-lg font-medium">Users</h1>
              <p className="text-3xl text-blue-700">{usersCount}</p>
            </div>
            <div className="mr-3">
              <FaUserAlt color="#395eff" size={40} />
            </div>
          </div>
        </Link>
      </div>

      <div className="p-2">
        <h1 className="mb-5 rounded-lg bg-[#0984ff0f] py-3 text-center text-2xl text-white">
          Latest Posts
        </h1>
        {lastPost.reverse().map((post) => (
          <div key={post.id} className="mb-3">
            <h1 className="text-lg font-medium">{post.title}</h1>
            <p className="text-sm text-gray-500">
              {post.createdAt.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
