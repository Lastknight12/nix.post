import Link from "next/link";
import { MdSpaceDashboard } from "react-icons/md";
import { BsCardText } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { IoMdHome } from "react-icons/io";

export default async function AdminPanel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className=" my-3 w-full">
      <div className=" mx-auto max-w-screen-2xl p-3">
        <div className=" flex gap-6">
          <div className=" rounded-md p-4 light light:bg-[#000000b3] dark:bg-[#0000007a]">
            <nav className=" flex flex-col gap-6">
              <Link
                href="/"
                className=" rounded-2xl bg-[#fff1] p-4 transition-colors hover:bg-[#ffffff20]"
              >
                <IoMdHome size={25} />
              </Link>
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
                className="rounded-2xl bg-[#fff1] p-4 transition-colors hover:bg-[#ffffff20]"
              >
                <FaUser size={25} />
              </Link>
            </nav>
          </div>

          <div className="flex-grow-[9] rounded-md p-4 light light:bg-[#000000b3] dark:bg-[#0000007a]">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
