import { Dropdown, DropdownTrigger } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { MdAdminPanelSettings } from "react-icons/md";
import ProfileDropDown from "../dropdown/ProfileDropDown";
import type { Session } from "next-auth";

interface UserInfoProps {
  session: Session | null;
}

export default function UserInfo({ session }: UserInfoProps) {
  return (
    <div className="ml-2 flex items-center gap-3 max-sm:gap-1">
      {session?.user.role == "Admin" ? (
        <Link href="/admin" className="max-[640px]:hidden">
          <MdAdminPanelSettings
            size={40}
            className="light light:text-defaultLight dark:text-defaultDark"
            aria-label="admin page link"
          />
        </Link>
      ) : null}

      <Dropdown
        classNames={{
          content: "dark:bg-[#222222]",
        }}
      >
        <DropdownTrigger>
          <div className="min-h-[40px] min-w-[40px] cursor-pointer rounded-full border-2 border-[#497ee7] p-1">
            <Image
              alt="User profile picture"
              src={`${session?.user.image}`}
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
        </DropdownTrigger>
        <ProfileDropDown user={session!.user} />
      </Dropdown>
    </div>
  );
}
