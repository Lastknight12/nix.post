"use client";

// next ui / components
import { DropdownItem, DropdownMenu } from "@nextui-org/react";
import Link from "next/link";
import Image from "next/image";

// auth
import { signOut } from "next-auth/react";

// hooks
import type { MainDropDown } from "~/types/types";

export function DropDownMenu({ userName, email, image }: MainDropDown) {
  return (
    <>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="user">
          <div className="flex items-center gap-3 border-b-1 pb-3 light light:border-[#eaeaea] dark:border-[#353434]">
            <Image
              className="rounded-full"
              src={`${image}`}
              width={50}
              height={50}
              alt="user image"
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
          className="transition-colors light light:hover:bg-[#ece8e8] dark:hover:bg-[#2c2c2c]"
        >
          <Link
            href={"/profile/" + userName}
            className="light light:text-[#000] dark:text-[#fff]"
          >
            Profile
          </Link>
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
