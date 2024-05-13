import Link from "next/link";
import Image from "next/image";
import { getServerAuthSession } from "~/server/auth";
import { MdSpaceDashboard } from "react-icons/md";
import { BsCardText } from "react-icons/bs";
import { FaUser } from "react-icons/fa";

export default async function AdminPanel({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  return (
    <main className=" my-3 w-full">
      <div className=" mx-auto max-w-screen-2xl p-3">
          <div className=" flex gap-6">
            <div className=" rounded-md bg-[#fff1] p-4">
              <nav className=" flex flex-col gap-6">
                <Link
                  href="/admin"
                  className=" rounded-2xl bg-[#fff1] p-4 transition-colors hover:bg-[#ffffff20]"
                >
                  <MdSpaceDashboard size={25} />
                </Link>

                <Link
                  href="/admin/posts"
                  className=" rounded-2xl bg-[#fff1] p-4 transition-colors hover:bg-[#ffffff20]"
                >
                  <BsCardText size={25} />
                </Link>

                <Link
                  href="/admin/users"
                  className=" rounded-2xl bg-[#fff1] p-4 transition-colors hover:bg-[#ffffff20]"
                >
                  <FaUser size={25} />
                </Link>
              </nav>
            </div>

            <div className="flex-grow-[9] rounded-md bg-[#fff1] p-4">
              <div className="mb-5">
                <div className="flex items-center gap-3">
                  <Image
                    alt="User profile"
                    src={`${session?.user.image}`}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div className=" mb-3">
                    <p className="mb-1">{session?.user.name}</p>
                    <p className="text-gray-500">{session?.user.email}</p>
                  </div>
                </div>
                {children}
              </div>
            </div>
          </div>
      </div>
    </main>
  );
}
