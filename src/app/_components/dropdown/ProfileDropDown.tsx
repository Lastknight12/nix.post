"use client";

// next ui / components
import { DropdownItem, DropdownMenu } from "@nextui-org/react";
import Image from "next/image";

// auth
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";
import { useRouter } from "next/navigation";

interface DropDownMenuProps {
  user: Session["user"];
}

export default function ProfileDropDown({ user }: DropDownMenuProps) {
  const { name: userName, email, image, subname } = user;

  const router = useRouter();

  return (
    <>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="user">
          <div className="flex items-center gap-3 border-b-1 pb-3 light light:border-[#eaeaea] dark:border-[#353434]">
            <div
              className="rounded-full w-[50px] h-[50px] object-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${image})`
              }}
            />
            <div>
              <p className="light light:text-black dark:text-white">
                {userName}
              </p>
              <p className="light light:text-black dark:text-white">{email}</p>
            </div>
          </div>
        </DropdownItem>

        <DropdownItem
          key="profile"
          className="transition-colors light light:text-black light:hover:bg-[#ece8e8] dark:text-white dark:hover:bg-[#2c2c2c]"
          onClick={() => router.push("/profile/" + subname)}
        >
          Profile
        </DropdownItem>

        <DropdownItem
          key="settings"
          className="transition-colors light light:text-black light:hover:bg-[#ece8e8] dark:text-white dark:hover:bg-[#2c2c2c]"
          onClick={() => router.push("/settings")}
        >
          Settings
        </DropdownItem>

        <DropdownItem
          key="delete"
          className="text-danger transition-colors light light:hover:bg-[#ece8e8] dark:hover:bg-[#2c2c2c]"
          color="danger"
          onClick={() => signOut()}
        >
          Log out
        </DropdownItem>
      </DropdownMenu>
    </>
  );
}
