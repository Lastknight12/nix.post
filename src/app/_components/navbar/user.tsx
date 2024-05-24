import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";

import { MdAdminPanelSettings } from "react-icons/md";

import { signOut } from "next-auth/react";
import type { UserInfo } from "~/types/types";

export default function UserInfo({ session }: UserInfo) {
  return (
    <div className=" flex items-center gap-3 max-sm:gap-1">
      {session?.user.role == "Admin" ? (
        <Link href="/admin" className="max-[640px]:hidden">
          <MdAdminPanelSettings
            size={40}
            className="light light:text-[#52525b] dark:text-[#a1a1aa]"
            aria-label="admin page link"
          />
        </Link>
      ) : null}

      <Dropdown>
        <DropdownTrigger>
          <div className=" min-h-[40px] min-w-[40px] cursor-pointer rounded-full border-2 border-[#497ee7] p-1">
            <Image
              alt="User profile picture"
              src={`${session?.user.image}`}
              width={40}
              height={40}
              className=" rounded-full"
            />
          </div>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem key="new">
            <Link
              href={"/profile/" + session?.user.name}
              className=" light light:text-[#000] dark:text-[#fff]"
            >
              Profile
            </Link>
          </DropdownItem>
          <DropdownItem
            key="delete"
            className="text-danger"
            color="danger"
            onClick={() => signOut()}
          >
            Log out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
