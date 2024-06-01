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
import { DropDown } from "../dropdown/DropDownMenu";

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
              src={`https://cdn.discordapp.com/icons/969521486291427419/ce021588b8fa6d292435e073adcdb027.webp?size=240`}
              width={40}
              height={40}
              className=" rounded-full"
            />
          </div>
        </DropdownTrigger>
        <DropDown userName={session?.user.name} email={session?.user.email} image={session?.user.image}/>
      </Dropdown>
    </div>
  );
}
